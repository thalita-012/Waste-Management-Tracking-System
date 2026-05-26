import { Truck } from "../models/Truck";
export declare class TrackingService {
    private trucks;
    createTruck(data: {
        id: number | string;
        truckNumber: string;
        driverId: number | string;
    }): Truck;
    addTruck(truck: Truck): Truck;
    getTruckById(id: number | string): Truck | undefined;
    updateTruckLocation(id: number | string, location: unknown): Truck | undefined;
    updateTruckStatus(id: number | string, status: string): Truck | undefined;
    getAllTrucks(): Truck[];
}
export { TrackingService as TruckService };
//# sourceMappingURL=TruckService.d.ts.map