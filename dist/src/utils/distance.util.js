export class DistanceUtil {
    static calculateDistance(truckLat, truckLag, userLat, userLng) {
        const dx = truckLat - userLat;
        const dy = truckLag - userLng;
        return Math.sqrt(dx * dx + dy * dy);
    }
}
