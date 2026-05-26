import { Request, Response } from "express";

import { TruckService } from "../services/TruckService";

export class TruckController {

    private truckService =
        new TruckService();

    // Create Truck
    createTruck = (
        req: Request,
        res: Response
    ): void => {

        const truck =
            this.truckService.createTruck(
                req.body
            );

        res.status(201).json({
            message: "Truck created successfully",
            data: truck
        });
    };

    // Get All Trucks
    getAllTrucks = (
        req: Request,
        res: Response
    ): void => {

        const trucks =
            this.truckService.getAllTrucks();

        res.status(200).json({
            data: trucks
        });
    };
}