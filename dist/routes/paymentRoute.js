"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const PaymentController_js_1 = require("../controllers/PaymentController.js");
const router = (0, express_1.Router)();
const controller = new PaymentController_js_1.PaymentController();
router.post('/bakong/create', controller.createPayment);
router.post('/bakong/decode', controller.decodeKhqr);
router.get('/bakong/account-check', controller.checkBakongAccount);
router.get('/bakong/verify/:orderId', controller.verifyPayment);
router.get('/bakong/qr/:orderId', controller.getPaymentQr);
exports.default = router;
//# sourceMappingURL=paymentRoute.js.map