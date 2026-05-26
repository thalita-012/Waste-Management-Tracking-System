import { Truck } from "../models/Truck";

export class TrackingService {

    private trucks: Truck[] = [];

    // Add truck
    addTruck(truck: Truck): void {
        this.trucks.push(truck);
    }

    // Update truck location
    updateTruckLocation(
        id: number,
        location: string
    ): Truck | undefined {

        const truck = this.trucks.find(
            t => t.id === id
        );

        if (truck) {
            truck.updateLocation(location);
        }

        return truck;
    }

    // Change status
    updateTruckStatus(
        id: number,
        status: string
    ): Truck | undefined {

        const truck = this.trucks.find(
            t => t.id === id
        );

        if (truck) {
            truck.updateStatus(status);
        }

        return truck;
    }

    // Get all trucks
    getAllTrucks(): Truck[] {
        return this.trucks;
    }
}