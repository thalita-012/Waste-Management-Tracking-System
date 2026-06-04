import { Truck } from "../models/Truck";
export declare class TruckRepository {
    private trucks;
    create(truck: Truck): Truck;
    findAll(): Truck[];
    findById(id: number | string): Truck | undefined;
    updateLocation(id: number | string, location: string): Truck | undefined;
    updateStatus(id: number | string, status: string): Truck | undefined;
    delete(id: number | string): boolean;
}
//# sourceMappingURL=TruckRepository.d.ts.map