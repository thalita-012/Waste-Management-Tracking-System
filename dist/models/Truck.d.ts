export declare class Truck {
    id: number;
    truckNumber: string;
    liveLocation: string;
    status: string;
    driveId: number;
    constructor(id: number, truckNumber: string, driveId: number);
    updateLocation(location: string): void;
    updateStatus(status: string): void;
    getTruckInfo(): {
        id: number;
        truckNumber: string;
        liveLocation: string;
        status: string;
        driveId: number;
    };
}
//# sourceMappingURL=Truck.d.ts.map