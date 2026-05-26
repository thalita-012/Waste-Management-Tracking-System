import type { Request, Response } from "express";
import { TruckService } from "../services/TruckService.js";

export class TruckController {
    private truckService: TruckService;

    constructor() {
        this.truckService = new TruckService();
    }

    // Create Truck
    createTruck = async (req: Request, res: Response): Promise<void> => {
        try {
            // Add validation
            const { id, truckNumber, driverId } = req.body;
            
            if (!id || !truckNumber || !driverId) {
                res.status(400).json({
                    success: false,
                    message: "Missing required fields: id, truckNumber, or driverId"
                });
                return;
            }

            const truck = this.truckService.createTruck(req.body);

            res.status(201).json({
                success: true,
                message: "Truck created successfully",
                data: truck
            });
        } catch (error) {
            console.error("Error creating truck:", error);
            res.status(500).json({
                success: false,
                message: "Internal server error",
                error: error instanceof Error ? error.message : "Unknown error"
            });
        }
    };

    // Get All Trucks
    getAllTrucks = async (req: Request, res: Response): Promise<void> => {
        try {
            const trucks = this.truckService.getAllTrucks();

            if (!trucks || trucks.length === 0) {
                res.status(200).json({
                    success: true,
                    message: "No trucks found",
                    data: []
                });
                return;
            }

            res.status(200).json({
                success: true,
                data: trucks,
                count: trucks.length
            });
        } catch (error) {
            console.error("Error getting trucks:", error);
            res.status(500).json({
                success: false,
                message: "Internal server error",
                error: error instanceof Error ? error.message : "Unknown error"
            });
        }
    };

    // Get Truck by ID (additional useful method)
    getTruckById = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            
            if (!id) {
                res.status(400).json({
                    success: false,
                    message: "Truck ID is required"
                });
                return;
            }

            const truck = this.truckService.getTruckById(id);

            if (!truck) {
                res.status(404).json({
                    success: false,
                    message: "Truck not found"
                });
                return;
            }

            res.status(200).json({
                success: true,
                data: truck
            });
        } catch (error) {
            console.error("Error getting truck:", error);
            res.status(500).json({
                success: false,
                message: "Internal server error",
                error: error instanceof Error ? error.message : "Unknown error"
            });
        }
    };

    // Update Truck Location (if you need HTTP endpoint for this as well)
    updateTruckLocation = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const { liveLocation } = req.body;

            if (!id || !liveLocation) {
                res.status(400).json({
                    success: false,
                    message: "Missing required fields: id or liveLocation"
                });
                return;
            }

            const updatedTruck = this.truckService.updateTruckLocation(id, liveLocation);

            if (!updatedTruck) {
                res.status(404).json({
                    success: false,
                    message: "Truck not found"
                });
                return;
            }

            res.status(200).json({
                success: true,
                message: "Truck location updated successfully",
                data: updatedTruck.getTruckInfo()
            });
        } catch (error) {
            console.error("Error updating truck location:", error);
            res.status(500).json({
                success: false,
                message: "Internal server error",
                error: error instanceof Error ? error.message : "Unknown error"
            });
        }
    };
}
