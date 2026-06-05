import { Router } from 'express';
import { PaymentController } from '../controllers/PaymentController.js';

const router = Router();
const controller = new PaymentController();

router.post('/', controller.createPayment);
router.post('/bakong/create', controller.createPayment);
router.post('/create', controller.createPayment);
router.post('/bakong/decode', controller.decodeKhqr);
router.get('/bakong/account-check', controller.checkBakongAccount);
router.get('/bakong/verify/:orderId', controller.verifyPayment);
router.get('/bakong/qr/:orderId', controller.getPaymentQr);

export default router;
