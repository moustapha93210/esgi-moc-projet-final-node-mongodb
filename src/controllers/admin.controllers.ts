import { type Request, type Response } from "express";
import { findDeviceByDeviceId, findDevicesByStatus, updateDeviceStatus } from "../repositories/devices.repository.ts";
import { countTelemetryByDeviceId, findTelemetryByDeviceId } from "../repositories/telemetry.repository.ts";
import { number } from "zod";



// POST /admin/devices/:id/approve
export const postAdminApprove = async (req: Request, res: Response) => {
    
    try {

        const deviceIdRecuperated = req.params.id;

        if(typeof deviceIdRecuperated !== "string")
        {
            return res.status(400).json({ message: "Bad Request" });
        }


        const deviceFinded = await findDeviceByDeviceId(deviceIdRecuperated);

        if(!deviceFinded)
        {
            return res.status(404).json({ message: "Not Found" });
        }


        await updateDeviceStatus(deviceFinded.deviceId, "active");
        

        return res.status(200).json({ message: "OK" });
        
    } catch(error) {

        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
    
}



// POST /admin/devices/:id/revoke
export const postAdminRevoke = async (req: Request, res: Response) => {
    
    try {

        const deviceIdRecuperated = req.params.id;

        if(typeof deviceIdRecuperated !== "string")
        {
            return res.status(400).json({ message: "Bad Request" });
        }


        const deviceFinded = await findDeviceByDeviceId(deviceIdRecuperated);

        if(!deviceFinded)
        {
            return res.status(404).json({ message: "Not Found" });
        }


        await updateDeviceStatus(deviceFinded.deviceId, "revoked");
        

        return res.status(200).json({ message: "OK" });
        
    } catch(error) {

        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
    
}



// GET /admin/devices?status=:status
export const getAdminStatus = async (req: Request, res: Response) => {

    try {

        const deviceStatusRecuperated = req.query.status;
        //console.log("deviceStatusRecuperated: ", deviceStatusRecuperated);

        if(deviceStatusRecuperated !== undefined && typeof deviceStatusRecuperated !== "string")
        {
            return res.status(400).json({ message: "Bad Request "});
        }

        const devicesFinded = await findDevicesByStatus(deviceStatusRecuperated);

        return res.status(200).json(devicesFinded);
        
    } catch(error) {

        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};



// GET /admin/devices/:id
export const getAdminId = async (req: Request, res: Response) => {

    try {

        const deviceIdRecuperated = req.params.id;
        //console.log("deviceIdRecuperated: ", deviceIdRecuperated);

        if(typeof deviceIdRecuperated !== "string")
        {
            return res.status(400).json({ message: "Bad Request" });
        }

        const deviceFinded = await findDeviceByDeviceId(deviceIdRecuperated);

        if(!deviceFinded)
        {
            return res.status(404).json({ message: "Not Found" });
        }

        return res.status(200).json(deviceFinded);
        
    } catch(error) {

        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};



// GET /admin/devices/:id/telemetry
export const getAdminDevicesIdTelemetry = async (req: Request, res: Response) => {

    try {

        const deviceIdRecuperated = req.params.id;
        
        if(typeof deviceIdRecuperated !== "string")
        {
            return res.status(400).json({ message: "Bad Request" });
        }


        const deviceFinded = await findDeviceByDeviceId(deviceIdRecuperated);

        if(!deviceFinded)
        {
            return res.status(404).json({ message: "Not Found" });
        }


        const limit = req.query.limit;
        
        if(limit !== undefined && typeof limit !== "string")
        {
            return res.status(400).json({ message: "Bad Request "});
        }

        const offset = req.query.offset
        
        if(offset !== undefined && typeof offset !== "string")
        {
            return res.status(400).json({ message: "Bad Request "});
        }


        const numberLimit = limit ? Number(limit) : 20;
        const numberOffset = offset ? Number(offset) : 0;

        if(Number.isNaN(numberLimit) || Number.isNaN(numberOffset))
        {
            return res.status(400).json({ message: "Bad Request" });
        }

        const finalLimit = Math.min(numberLimit, 100);


        const telemtryFinded = await findTelemetryByDeviceId(deviceIdRecuperated, finalLimit, numberOffset);
        const numberOfTelemetryFinded = await countTelemetryByDeviceId(deviceIdRecuperated);


        return res.status(200).json({
            "data": telemtryFinded,
            "pagination": {
                "total": numberOfTelemetryFinded,
                "limit": finalLimit,
                "offset": numberOffset
            }
        });

    } catch(error) {
        
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
