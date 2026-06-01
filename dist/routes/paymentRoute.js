import { Router } from 'express';
<<<<<<< HEAD
import { PaymentController } from '../controllers/PaymentController.js';
const router = Router();
const controller = new PaymentController();
router.post('/bakong/create', controller.createPayment);
router.post('/bakong/decode', controller.decodeKhqr);
router.get('/bakong/account-check', controller.checkBakongAccount);
router.get('/bakong/verify/:orderId', controller.verifyPayment);
router.get('/bakong/qr/:orderId', controller.getPaymentQr);
=======
import { PaymentController } from '../controllers/PaymentController';
const router = Router();
const controller = new PaymentController();
router.post('/bakong/create', controller.createPayment);
router.get('/bakong/verify/:orderId', controller.verifyPayment);
>>>>>>> b7808adb37a07e5f45a60d6aaf8cba3683e41758
export default router;
//# sourceMappingURL=paymentRoute.js.map