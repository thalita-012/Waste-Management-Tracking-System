// 1. FIXED: Added missing LiveLocation interface
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
    liveLocation: LiveLocation; // Now works perfectly!
    targetLocation?: {
        latitude: number;
        longitude: number;
    };
}

export interface UpdateStatusData {
    id: string;
    // 2. IMPROVEMENT: Added 'arrived' to allowed statuses so the automation rules don't crash
    status: 'idle' | 'moving' | 'loading' | 'unloading' | 'offline' | 'arrived';
}