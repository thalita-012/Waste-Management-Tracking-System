import { Truck } from "../models/Truck.js";
export class TrackingService {
    constructor() {
        this.trucks = [];
    }
    // Create/register truck (HTTP-friendly wrapper)
    createTruck(data) {
        const id = this.normalizeId(data.id);
        const driverId = this.normalizeId(data.driverId);
        if (!id || !driverId) {
            throw new Error("Invalid id or driverId");
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
        const truckId = this.normalizeId(id);
        if (!truckId)
            return undefined;
        return this.trucks.find(t => t.id === truckId);
    }
    // Update truck location
    updateTruckLocation(id, location) {
        const truckId = this.normalizeId(id);
        if (!truckId)
            return undefined;
        const truck = this.trucks.find(t => t.id === truckId);
        if (truck) {
            const locationStr = typeof location === "string" ? location : JSON.stringify(location);
            truck.updateLocation(locationStr);
        }
        return truck;
    }
    // Change status
    updateTruckStatus(id, status) {
        const truckId = this.normalizeId(id);
        if (!truckId)
            return undefined;
        const truck = this.trucks.find(t => t.id === truckId);
        if (truck) {
            truck.updateStatus(status);
        }
        return truck;
    }
    // Get all trucks
    getAllTrucks() {
        return this.trucks;
    }
    normalizeId(id) {
        return String(id).trim();
    }
}
// Backwards-compatible name for newer code
export { TrackingService as TruckService };
//# sourceMappingURL=TruckService.js.map