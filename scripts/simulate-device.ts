/**
 * Script: simulate:device
 *
 * Simule un device IoT complet :
 * 1. S'enregistre auprès de l'API
 * 2. Poll son status jusqu'à activation
 * 3. Envoie de la télémétrie en boucle
 *
 * Usage:
 *   pnpm simulate:device [--type climate|presence] [--name "Mon capteur"]
 *
 * Environnement:
 *   API_URL - URL de l'API (défaut: http://localhost:3000)
 *
 * Options:
 *   --type    Type de device: climate ou presence (défaut: climate)
 *   --name    Nom du device (défaut: généré automatiquement)
 */

const API_URL = process.env.API_URL ?? "http://localhost:3000";

// Parsing des arguments
const parseArgs = (): { type: "climate" | "presence"; name: string } => {
  const args = process.argv.slice(2);
  let type: "climate" | "presence" = "climate";
  let name = "";

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--type" && args[i + 1]) {
      const value = args[i + 1];
      if (value === "climate" || value === "presence") {
        type = value;
      }
      i++;
    } else if (args[i] === "--name" && args[i + 1]) {
      name = args[i + 1];
      i++;
    }
  }

  if (!name) {
    name = `${type}-sensor-${Date.now().toString(36)}`;
  }

  return { type, name };
};

// Génération d'un UUID v4 simple
const generateUUID = (): string => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

// Génération de données de télémétrie
const generateTelemetry = (
  type: "climate" | "presence",
): Record<string, unknown> => {
  const base = {
    timestamp: new Date().toISOString(),
    battery: Math.round(70 + Math.random() * 30), // 70-100%
  };

  if (type === "climate") {
    return {
      ...base,
      temperature: Math.round((18 + Math.random() * 8) * 10) / 10, // 18-26°C
      humidity: Math.round(40 + Math.random() * 30), // 40-70%
    };
  } else {
    return {
      ...base,
      motion: Math.random() > 0.7, // 30% de chance de détection
    };
  }
};

// Pause
const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Enregistrement du device
const registerDevice = async (
  deviceId: string,
  name: string,
  type: "climate" | "presence",
): Promise<{ deviceAccessKey: string; status: string }> => {
  console.log(`📝 Enregistrement du device...`);
  console.log(`   ID: ${deviceId}`);
  console.log(`   Nom: ${name}`);
  console.log(`   Type: ${type}`);

  const response = await fetch(`${API_URL}/devices/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ deviceId, name, type }),
  });

  if (!response.ok) {
    const errorData = (await response.json().catch(() => ({}))) as {
      message?: string;
    };
    throw new Error(
      `Erreur ${response.status}: ${errorData.message ?? response.statusText}`,
    );
  }

  const data = (await response.json()) as {
    deviceAccessKey: string;
    status: string;
  };
  console.log(`✅ Enregistré avec succès`);
  console.log(`   Device Access Key: ${data.deviceAccessKey}`);
  console.log(`   Status: ${data.status}`);

  return data;
};

// Vérification du status
const checkStatus = async (deviceKey: string,): Promise <{ status: string; deviceId: string }> => {
  
  const response = await fetch(`${API_URL}/devices/me`, {
    headers: { "x-device-key": deviceKey },
  });

  if (!response.ok) {
    const errorData = (await response.json().catch(() => ({}))) as {
      message?: string;
    };
    throw new Error(
      `Erreur ${response.status}: ${errorData.message ?? response.statusText}`,
    );
  }

  return response.json() as Promise<{ status: string; deviceId: string }>;
};

// Poll jusqu'à activation
const waitForActivation = async (
  deviceKey: string,
  maxAttempts = 60,
  intervalMs = 5000,
): Promise<void> => {
  console.log(`\n⏳ En attente d'approbation par l'admin...`);
  console.log(
    `   (Poll toutes les ${intervalMs / 1000}s, max ${maxAttempts} tentatives)`,
  );
  console.log(`   💡 Utilisez: pnpm admin:approve-device <deviceId>\n`);

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const { status } = await checkStatus(deviceKey);

    if (status === "active") {
      console.log(`\n✅ Device activé !`);
      return;
    }

    if (status === "revoked") {
      throw new Error("Device révoqué par l'admin");
    }

    process.stdout.write(
      `   Tentative ${attempt}/${maxAttempts} - Status: ${status}\r`,
    );
    await sleep(intervalMs);
  }

  throw new Error("Timeout: le device n'a pas été approuvé à temps");
};

// Envoi de télémétrie
const sendTelemetry = async (
  deviceKey: string,
  type: "climate" | "presence",
): Promise<void> => {
  const telemetry = generateTelemetry(type);

  const response = await fetch(`${API_URL}/telemetry`, {
    method: "POST",
    headers: {
      "x-device-key": deviceKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(telemetry),
  });

  if (!response.ok) {
    const errorData = (await response.json().catch(() => ({}))) as {
      message?: string;
    };
    throw new Error(
      `Erreur ${response.status}: ${errorData.message ?? response.statusText}`,
    );
  }

  // Affichage selon le type
  if (type === "climate") {
    const t = telemetry as {
      temperature: number;
      humidity: number;
      battery: number;
    };
    console.log(
      `📡 Télémétrie envoyée: ${t.temperature}°C, ${t.humidity}% HR, batterie ${t.battery}%`,
    );
  } else {
    const t = telemetry as { motion: boolean; battery: number };
    console.log(
      `📡 Télémétrie envoyée: motion=${t.motion}, batterie ${t.battery}%`,
    );
  }
};

// Boucle d'envoi de télémétrie
const telemetryLoop = async (
  deviceKey: string,
  type: "climate" | "presence",
  intervalMs = 10000,
): Promise<void> => {
  console.log(
    `\n🔄 Démarrage de l'envoi de télémétrie (toutes les ${intervalMs / 1000}s)`,
  );
  console.log(`   Appuyez sur Ctrl+C pour arrêter\n`);

  while (true) {
    try {
      await sendTelemetry(deviceKey, type);
    } catch (error) {
      if (error instanceof Error) {
        console.error(`❌ Erreur: ${error.message}`);

        // Si révoqué, on arrête
        if (error.message.includes("403")) {
          console.log(`\n⛔ Device révoqué, arrêt de la simulation`);
          break;
        }
      }
    }

    await sleep(intervalMs);
  }
};

// Main
const main = async () => {
  console.log("🚀 Simulation de device IoT\n");

  const { type, name } = parseArgs();
  const deviceId = generateUUID();

  try {
    // 1. Enregistrement
    const { deviceAccessKey } = await registerDevice(deviceId, name, type);

    // 2. Attente d'activation
    await waitForActivation(deviceAccessKey);

    // 3. Envoi de télémétrie en boucle
    await telemetryLoop(deviceAccessKey, type);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`\n❌ Erreur fatale: ${error.message}`);
    }
    process.exit(1);
  }
};

main();
