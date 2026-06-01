<<<<<<< HEAD
// Truck model logic removed. Keeping file for structure.
export {};
=======
export class Truck {
    constructor(id, truckNumber, driveId) {
        this.id = id;
        this.truckNumber = truckNumber;
        this.driveId = driveId;
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
            driveId: this.driveId
        };
    }
}
>>>>>>> b7808adb37a07e5f45a60d6aaf8cba3683e41758
//# sourceMappingURL=Truck.js.map