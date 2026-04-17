import express from "express";
import routes from "./routes/index.ts";

const app = express();

app.use(express.json());
app.use(routes);






//app.use(notFoundHandler);   // 404 pour routes inconnues
//app.use(errorHandler);      // Gère toutes les erreurs

export default app;
