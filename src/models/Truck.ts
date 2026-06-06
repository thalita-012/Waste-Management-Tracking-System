export class Truck {
    public id: string;
    public truckNumber: string;
    public liveLocation: string;
    public status: string;
    public driverId: string;

    constructor(
        id: string,
        truckNumber: string,
        driverId: string

    ) {
        this.id = id;
        this.truckNumber = truckNumber;
        this.driverId = driverId;

        this.liveLocation = "";
        this.status = "offline";
    }
    //update of truck

    updateLocation(location: string): void {
        this.liveLocation = location;
        this.status = "moving";
    }
    //change truck

    updateStatus(status: string): void {
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
