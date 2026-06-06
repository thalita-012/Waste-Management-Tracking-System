export interface LiveLocation {
    latitude: number;
    longitude: number;
}
export interface RegisterTruckData {
    id: string;
    truckNumber: string;
    driverId: string;
}
export interface UpdateLocationData {
    id: string;
    liveLocation: LiveLocation;
    targetLocation?: {
        latitude: number;
        longitude: number;
    };
}
export interface UpdateStatusData {
    id: string;
    status: 'idle' | 'moving' | 'loading' | 'unloading' | 'offline' | 'arrived';
}
//# sourceMappingURL=truck.types.d.ts.map