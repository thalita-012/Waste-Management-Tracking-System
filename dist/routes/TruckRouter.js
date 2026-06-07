"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const TruckController_js_1 = require("../controllers/TruckController.js");
const router = (0, express_1.Router)();
const truckController = new TruckController_js_1.TruckController();
router.post("/trucks", truckController.createTruck);
router.get("/trucks", truckController.getAllTrucks);
router.get("/trucks/:id", truckController.getTruckById);
router.put("/trucks/:id/location", truckController.updateTruckLocation);
exports.default = router;
//# sourceMappingURL=TruckRouter.js.map