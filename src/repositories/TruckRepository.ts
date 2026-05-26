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
    findById(id: number): Truck | undefined {

        return this.trucks.find(
            truck => truck.id === id
        );
    }

    // Update Location
    updateLocation(
        id: number,
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
        id: number,
        status: string
    ): Truck | undefined {

        const truck = this.findById(id);

        if (truck) {
            truck.status = status;
        }

        return truck;
    }

    // Delete Truck
    delete(id: number): boolean {

        const index = this.trucks.findIndex(
            truck => truck.id === id
        );

        if (index !== -1) {

            this.trucks.splice(index, 1);

            return true;
        }

        return false;
    }
}