export class Truck {
    public id: number;
    public truckNumber: string;
    public liveLocation: string;
    public status: string;
    public driveId: number;

    constructor(
        id: number,
        truckNumber: string,
        driveId: number

    ) {
        this.id = id;
        this.truckNumber = truckNumber;
        this.driveId = driveId;

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
            driveId: this.driveId
        };
    }
}