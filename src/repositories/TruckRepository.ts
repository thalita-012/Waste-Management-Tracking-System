import { Truck } from "../models/Truck";

export class TruckRepository {

    private trucks: Truck[] = [];

    // Create Truck
    create(truck: Truck): Truck {

        this.trucks.push(truck);

        return truck;
    }

    // Find All Trucks
    findAll(): Truck[] {
        return this.trucks;
    }

    // Find Truck By ID
    findById(id: number | string): Truck | undefined {
        const truckId = String(id).trim();

        return this.trucks.find(
            truck => truck.id === truckId
        );
    }

    // Update Location
    updateLocation(
        id: number | string,
        location: string
    ): Truck | undefined {

        const truck = this.findById(id);

        if (truck) {
            truck.liveLocation = location;
        }

        return truck;
    }

    // Update Status
    updateStatus(
        id: number | string,
        status: string
    ): Truck | undefined {

        const truck = this.findById(id);

        if (truck) {
            truck.status = status;
        }

        return truck;
    }

    // Delete Truck
    delete(id: number | string): boolean {
        const truckId = String(id).trim();

        const index = this.trucks.findIndex(
            truck => truck.id === truckId
        );

        if (index !== -1) {

            this.trucks.splice(index, 1);

            return true;
        }

        return false;
    }
}
