"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Truck = void 0;
class Truck {
    constructor(id, truckNumber, driverId) {
        this.id = id;
        this.truckNumber = truckNumber;
        this.driverId = driverId;
        this.liveLocation = "";
        this.status = "offline";
    }
    //update of truck
    updateLocation(location) {
        this.liveLocation = location;
        this.status = "moving";
    }
    //change truck
    updateStatus(status) {
        this.status = status;
    }
    //return truck data
    getTruckInfo() {
        return {
            id: this.id,
            truckNumber: this.truckNumber,
            liveLocation: this.liveLocation,
            status: this.status,
            driverId: this.driverId
        };
    }
}
exports.Truck = Truck;
//# sourceMappingURL=Truck.js.map