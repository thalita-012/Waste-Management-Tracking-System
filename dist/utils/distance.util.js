"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DistanceUtil = void 0;
class DistanceUtil {
    static calculateDistance(truckLat, truckLag, userLat, userLng) {
        const dx = truckLat - userLat;
        const dy = truckLag - userLng;
        return Math.sqrt(dx * dx + dy * dy);
    }
}
exports.DistanceUtil = DistanceUtil;
//# sourceMappingURL=distance.util.js.map