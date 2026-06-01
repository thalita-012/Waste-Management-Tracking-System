<<<<<<< HEAD
export {};
=======
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
>>>>>>> b7808adb37a07e5f45a60d6aaf8cba3683e41758
//# sourceMappingURL=Truck.d.ts.map