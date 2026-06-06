import type { Request, Response } from "express";
export declare class TruckController {
    private truckService;
    constructor();
    createTruck: (req: Request, res: Response) => Promise<void>;
    getAllTrucks: (req: Request, res: Response) => Promise<void>;
    getTruckById: (req: Request, res: Response) => Promise<void>;
    updateTruckLocation: (req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=TruckController.d.ts.map