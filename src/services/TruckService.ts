import { Truck } from "../models/Truck.js";

export class TrackingService {

    private trucks: Truck[] = [];

    // Create/register truck (HTTP-friendly wrapper)
    createTruck(data: { id: number | string; truckNumber: string; driverId: number | string }): Truck {
        const id = Number(data.id);
        const driverId = Number(data.driverId);

        if (!Number.isFinite(id) || !Number.isFinite(driverId)) {
            throw new Error("Invalid id or driverId (must be numeric)");
        }

        const truck = new Truck(id, data.truckNumber, driverId);
        return this.addTruck(truck);
    }

    // Add truck
    addTruck(truck: Truck): Truck {
        this.trucks.push(truck);
        return truck;
    }

    // Get truck by id
    getTruckById(id: number | string): Truck | undefined {
        const numericId = Number(id);
        if (!Number.isFinite(numericId)) return undefined;
        return this.trucks.find(t => t.id === numericId);
    }

    // Update truck location
    updateTruckLocation(
        id: number | string,
        location: unknown
    ): Truck | undefined {

        const numericId = Number(id);
        if (!Number.isFinite(numericId)) return undefined;

        const truck = this.trucks.find(t => t.id === numericId);

        if (truck) {
            const locationStr = typeof location === "string" ? location : JSON.stringify(location);
            truck.updateLocation(locationStr);
        }

        return truck;
    }

    // Change status
    updateTruckStatus(
        id: number | string,
        status: string
    ): Truck | undefined {

        const numericId = Number(id);
        if (!Number.isFinite(numericId)) return undefined;

        const truck = this.trucks.find(t => t.id === numericId);

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

// Backwards-compatible name for newer code
export { TrackingService as TruckService };
