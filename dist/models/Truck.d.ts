export declare class Truck {
    id: string;
    truckNumber: string;
    liveLocation: string;
    status: string;
    driverId: string;
    constructor(id: string, truckNumber: string, driverId: string);
    updateLocation(location: string): void;
    updateStatus(status: string): void;
    getTruckInfo(): {
        id: string;
        truckNumber: string;
        liveLocation: string;
        status: string;
        driverId: string;
    };
}
