import { Truck } from "../models/Truck";
export declare class TruckRepository {
    private trucks;
    create(truck: Truck): Truck;
    findAll(): Truck[];
    findById(id: number): Truck | undefined;
    updateLocation(id: number, location: string): Truck | undefined;
    updateStatus(id: number, status: string): Truck | undefined;
    delete(id: number): boolean;
}
//# sourceMappingURL=TruckRepository.d.ts.map