
import { Router } from "express";
import { TruckController } from "../controllers/TruckController.js";

const router = Router();
const truckController = new TruckController();

router.post("/trucks", truckController.createTruck);
router.get("/trucks", truckController.getAllTrucks);
router.get("/trucks/:id", truckController.getTruckById);
router.put("/trucks/:id/location", truckController.updateTruckLocation);

export default router;
