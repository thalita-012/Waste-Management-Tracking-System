import { Truck } from "../models/Truck";
export class TruckRepository {
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
        return this.trucks.find(truck => truck.id === id);
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
        const index = this.trucks.findIndex(truck => truck.id === id);
        if (index !== -1) {
            this.trucks.splice(index, 1);
            return true;
        }
        return false;
    }
}
//# sourceMappingURL=TruckRepository.js.map