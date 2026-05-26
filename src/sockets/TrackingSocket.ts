import { Server, Socket } from 'socket.io';

import { Truck } from '../models/Truck';
import { TrackingService } from '../services/TruckService';


const trackingService = new TrackingService();

export const truckingSocket = (io: Server): void => {
    io.on("connection", (socket: Socket) => {
        console.log("Client Connected:", socket.id);

        //Resgister Track
        socket.on("registerTruck", (data) => {

            const truck = new Truck(
                data.id,
                data.truckNumber,
                data.driverId
            );

            trackingService.addTruck(truck);

            console.log("Truck Registered");
        });
        //Update live location
        socket.on("updateLocation", (data) => {

            const updatedTruck =
                trackingService.updateTruckLocation(
                    data.id,
                    data.liveLocation
                );

            if (updatedTruck) {

                io.emit("truckUpdated", {
                    truck: updatedTruck.getTruckInfo()
                });

                console.log("Truck Location Updated");
            }
        });
        //Update status
        socket.on("updateStatus", (data) => {

            const updatedTruck =
                trackingService.updateTruckStatus(
                    data.id,
                    data.status
                );

            if (updatedTruck) {

                io.emit("truckUpdated", {
                    truck: updatedTruck.getTruckInfo()
                });

                console.log("Truck Status Updated");
            }
        });
        socket.on("disconnect", () => {
            console.log("Client Disconnected");
        });
    });
}