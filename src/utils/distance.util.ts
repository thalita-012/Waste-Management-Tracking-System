export class DistanceUtil {
    static calculateDistance (
        truckLat: number,
        truckLag: number,
        userLat: number,
        userLng: number,

    ): number {
        const dx = truckLat - userLat;
        const dy = truckLag - userLng;
        return Math.sqrt(dx * dx + dy * dy);
    }

}