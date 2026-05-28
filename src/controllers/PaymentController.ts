import { type Request, type Response } from 'express';
import QRCode from 'qrcode';
import { PaymentService } from '../services/PaymentService.js';
import { PaymentValidator } from '../utils/validators.js';
import { logger } from '../utils/logger.js';

export class PaymentController {
  private paymentService = new PaymentService();

  createPayment = async (req: Request, res: Response) => {
    try {
      const { orderId, amount, currency } = req.body;

      // ✅ STEP 1: Validate input
      const validation = PaymentValidator.validateCreatePayment(orderId, amount, currency || 'KHR');
      if (!validation.isValid) {
        logger.warn('Payment creation validation failed', {
          orderId,
          errors: validation.errors,
        });
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: validation.errors,
        });
      }

      logger.info('Creating payment', { orderId, amount, currency });

      const normalizedCurrency = (currency || 'KHR').toUpperCase() as 'KHR' | 'USD';
      const payment = await this.paymentService.createBakongPayment(
        orderId,
        Number(amount),
        normalizedCurrency
      );

      // ✅ STEP 5: Return only safe data (no khqrMd5, bakongTxId)
      return res.status(201).json({
        success: true,
        data: {
          id: payment.id,
          orderId: payment.orderId,
          amount: payment.amount,
          currency: payment.currency,
          qrString: payment.qrString,
          status: payment.status,
          createdAt: payment.createdAt,
        },
      });
    } catch (error: any) {
      // ✅ STEP 2: Handle specific errors with proper status codes
      logger.error('Payment creation error', {
        orderId: req.body.orderId,
        error: error.message,
      });

      if (error.message.includes('already exists')) {
        return res.status(409).json({
          success: false,
          message: 'Payment already exists for this order',
        });
      }

      if (error.message.includes('BAKONG_') || error.message.includes('KHQR') || error.message.includes('Bakong')) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Failed to create payment. Please try again later.',
      });
    }
  };

  verifyPayment = async (req: Request, res: Response) => {
    try {
      const { orderId } = req.params;

      // ✅ STEP 1: Validate input
      const validation = PaymentValidator.validateVerifyPayment(orderId || '');
      if (!validation.isValid) {
        logger.warn('Payment verification validation failed', {
          orderId,
          errors: validation.errors,
        });
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: validation.errors,
        });
      }

      logger.info('Verifying payment', { orderId });

      const result = await this.paymentService.verifyPayment(orderId || '');

      // ✅ STEP 5: Return only safe data
      return res.status(200).json({
        success: true,
        data: {
          orderId: result.orderId,
          paid: result.paid,
          status: result.status,
        },
      });
    } catch (error: any) {
      // ✅ STEP 2: Handle specific errors with proper status codes
      logger.error('Payment verification error', {
        orderId: req.params.orderId,
        error: error.message,
      });

      if (error.message.includes('not found')) {
        return res.status(404).json({
          success: false,
          message: 'Payment not found for this order',
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Failed to verify payment. Please try again later.',
      });
    }
  };

  getPaymentQr = async (req: Request, res: Response) => {
    try {
      const { orderId } = req.params;

      const validation = PaymentValidator.validateVerifyPayment(orderId || '');
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: validation.errors,
        });
      }

      const payment = await this.paymentService.getPaymentByOrderId(orderId || '');

      if (!payment.qrString) {
        return res.status(404).json({
          success: false,
          message: 'QR code not found for this payment',
        });
      }

      const qrPng = await QRCode.toBuffer(payment.qrString, {
        type: 'png',
        errorCorrectionLevel: 'M',
        width: 512,
        margin: 2,
      });

      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Cache-Control', 'no-store');
      return res.status(200).send(qrPng);
    } catch (error: any) {
      logger.error('Payment QR generation error', {
        orderId: req.params.orderId,
        error: error.message,
      });

      if (error.message.includes('not found')) {
        return res.status(404).json({
          success: false,
          message: 'Payment not found for this order',
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Failed to generate QR code. Please try again later.',
      });
    }
  };

  checkBakongAccount = async (_req: Request, res: Response) => {
    try {
      const result = await this.paymentService.checkConfiguredBakongAccount();

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      logger.error('Bakong account check error', {
        error: error.message,
      });

      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to check Bakong account',
      });
    }
  };

  decodeKhqr = async (req: Request, res: Response) => {
    try {
      const { qrString } = req.body;
      const result = this.paymentService.decodeKhqr(qrString);

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      logger.error('KHQR decode error', {
        error: error.message,
      });

      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to decode KHQR',
      });
    }
  };
}
