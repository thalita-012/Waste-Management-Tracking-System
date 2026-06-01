<<<<<<< HEAD
export {};
=======
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
>>>>>>> b7808adb37a07e5f45a60d6aaf8cba3683e41758
//# sourceMappingURL=TruckRepository.d.ts.map