import { TrackingService } from "../services/TruckService";
const trackingService = new TrackingService();
export const truckingSocket = (io) => {
    io.on("connection", (socket) => {
        console.log("Client Connected:", socket.id);
        socket.on("registerTruck", (data) => {
            // Add validation
            if (!data.id || !data.truckNumber || !data.driverId) {
                socket.emit("error", { message: "Missing required fields: id, truckNumber, or driverId" });
                return;
            }
            const truck = trackingService.createTruck({
                id: data.id,
                truckNumber: data.truckNumber,
                driverId: data.driverId,
            });
            // Send confirmation back to client
            socket.emit("truckRegistered", {
                success: true,
                truckId: truck.id
            });
            console.log("Truck Registered:", data.id);
        });
        // Update live location
        socket.on("updateLocation", (data) => {
            // Add validation
            if (!data.id || !data.liveLocation) {
                socket.emit("error", { message: "Missing required fields: id or liveLocation" });
                return;
            }
            const updatedTruck = trackingService.updateTruckLocation(data.id, data.liveLocation);
            if (updatedTruck) {
                io.emit("truckUpdated", {
                    truck: updatedTruck.getTruckInfo()
                });
                console.log("Truck Location Updated:", data.id);
            }
            else {
                socket.emit("error", { message: "Truck not found" });
            }
        });
        // Update status
        socket.on("updateStatus", (data) => {
            // Add validation
            if (!data.id || !data.status) {
                socket.emit("error", { message: "Missing required fields: id or status" });
                return;
            }
            const updatedTruck = trackingService.updateTruckStatus(data.id, data.status);
            if (updatedTruck) {
                io.emit("truckUpdated", {
                    truck: updatedTruck.getTruckInfo()
                });
                console.log("Truck Status Updated:", data.id);
            }
            else {
                socket.emit("error", { message: "Truck not found" });
            }
        });
        // Handle disconnection
        socket.on("disconnect", () => {
            console.log("Client Disconnected:", socket.id);
        });
    });
};
//# sourceMappingURL=TrackingSocket.js.map