import { Truck } from "../models/Truck.js";
export class TrackingService {
    constructor() {
        this.trucks = [];
    }
    // Create/register truck (HTTP-friendly wrapper)
    createTruck(data) {
        const id = Number(data.id);
        const driverId = Number(data.driverId);
        if (!Number.isFinite(id) || !Number.isFinite(driverId)) {
            throw new Error("Invalid id or driverId (must be numeric)");
        }
        const truck = new Truck(id, data.truckNumber, driverId);
        return this.addTruck(truck);
    }
    // Add truck
    addTruck(truck) {
        this.trucks.push(truck);
        return truck;
    }
    // Get truck by id
    getTruckById(id) {
        const numericId = Number(id);
        if (!Number.isFinite(numericId))
            return undefined;
        return this.trucks.find(t => t.id === numericId);
    }
    // Update truck location
    updateTruckLocation(id, location) {
        const numericId = Number(id);
        if (!Number.isFinite(numericId))
            return undefined;
        const truck = this.trucks.find(t => t.id === numericId);
        if (truck) {
            const locationStr = typeof location === "string" ? location : JSON.stringify(location);
            truck.updateLocation(locationStr);
        }
        return truck;
    }
    // Change status
    updateTruckStatus(id, status) {
        const numericId = Number(id);
        if (!Number.isFinite(numericId))
            return undefined;
        const truck = this.trucks.find(t => t.id === numericId);
        if (truck) {
            truck.updateStatus(status);
        }
        return truck;
    }
    // Get all trucks
    getAllTrucks() {
        return this.trucks;
    }
}
// Backwards-compatible name for newer code
export { TrackingService as TruckService };
//# sourceMappingURL=TruckService.js.map