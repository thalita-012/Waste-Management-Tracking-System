export interface RegisterTruckData {
    id: string;
    truckNumber: string;
    driverId: string;
}
export interface UpdateLocationData {
    id: string;
    liveLocation: {
        lat: number;
        lng: number;
        timestamp?: Date;
    };
}
export interface UpdateStatusData {
    id: string;
    status: 'idle' | 'moving' | 'loading' | 'unloading' | 'offline';
}
//# sourceMappingURL=truck.types.d.ts.map