// import type { Request, Response } from 'express';
// import { NotificationService } from '../services/NotificationService.js';

// export class NotificationController {
//   private notificationService: NotificationService;

//   constructor() {
//     this.notificationService = new NotificationService();
//   }

//   sendNearbyAlert = (req: Request, res: Response): void => {
//     const { userId, truckLat, truckLng, userLat, userLng } = req.body;

//     const notification =
//       this.notificationService.sendTruckNearbyNotification(
//         userId,
//         truckLat,
//         truckLng,
//         userLat,
//         userLng
//       );

//     if (!notification) {
//       res.status(200).json({
//         message: "Truck is still far away.",
//       });
//       return;
//     }

//     res.status(201).json({
//       message: "Notification sent successfully",
//       data: notification,
//     });
//   };

//   sendWeeklyReminder = (req: Request, res: Response): void => {
//     const { userId } = req.body;

//     const notification =
//       this.notificationService.sendWeeklyReminder(userId);

//     res.status(201).json({
//       message: "Weekly reminder sent",
//       data: notification,
//     });
//   };

//   getNotifications = (req: Request, res: Response): void => {
//     const userId = Number(req.params.userId);

//     const notifications =
//       this.notificationService.getUserNotifications(userId);

//     res.status(200).json({
//       data: notifications,
//     });
//   };
// }
