"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TruckRepository = void 0;
class TruckRepository {
    constructor() {
        this.trucks = [];
    }
    // Create Truck
    create(truck) {
        this.trucks.push(truck);
        return truck;
    }
    // Find All Trucks
    findAll() {
        return this.trucks;
    }
    // Find Truck By ID
    findById(id) {
        const truckId = String(id).trim();
        return this.trucks.find(truck => truck.id === truckId);
    }
    // Update Location
    updateLocation(id, location) {
        const truck = this.findById(id);
        if (truck) {
            truck.liveLocation = location;
        }
        return truck;
    }
    // Update Status
    updateStatus(id, status) {
        const truck = this.findById(id);
        if (truck) {
            truck.status = status;
        }
        return truck;
    }
    // Delete Truck
    delete(id) {
        const truckId = String(id).trim();
        const index = this.trucks.findIndex(truck => truck.id === truckId);
        if (index !== -1) {
            this.trucks.splice(index, 1);
            return true;
        }
        return false;
    }
}
exports.TruckRepository = TruckRepository;
//# sourceMappingURL=TruckRepository.js.map