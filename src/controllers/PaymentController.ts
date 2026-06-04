import { type Request, type Response } from 'express';
import QRCode from 'qrcode';
import { PaymentService } from '../services/PaymentService.js';
import { PaymentValidator } from '../utils/validators.js';
import { logger } from '../utils/logger.js';

type PaymentCurrency = 'KHR' | 'USD';

type CreatePaymentBody = {
  orderId: string | undefined;
  amount?: unknown;
  currency: string | undefined;
};

type CreatePaymentCommand = {
  orderId: string;
  amount: number;
  currency: PaymentCurrency;
};

type ValidationResult = {
  isValid: boolean;
  errors: string[];
};

type SafePaymentSource = {
  id: number;
  orderId: string;
  amount: number;
  currency: string;
  qrString: string | null;
  status: string;
  createdAt: Date;
};

export class PaymentController {
  constructor(private readonly paymentService = new PaymentService()) {}

  createPayment = async (req: Request, res: Response) => {
    try {
      const input = this.getCreatePaymentInput(req);
      const validation = this.validateCreatePaymentInput(input);

      if (this.hasValidationError(validation)) {
        logger.warn('Payment creation validation failed', {
          orderId: input.orderId,
          errors: validation.errors,
        });
        return this.sendValidationError(res, validation);
      }

      const command = this.toCreatePaymentCommand(input);
      logger.info('Creating payment', command);

      const payment = await this.paymentService.createBakongPayment(
        command.orderId,
        command.amount,
        command.currency,
      );

      return res.status(201).json({
        success: true,
        data: this.toSafePaymentResponse(payment),
      });
    } catch (error: unknown) {
      return this.handleCreatePaymentError(req, res, error);
    }
  };

  verifyPayment = async (req: Request, res: Response) => {
    try {
      const orderId = this.getOrderIdParam(req);
      const validation = this.validateOrderId(orderId);

      if (this.hasValidationError(validation)) {
        logger.warn('Payment verification validation failed', {
          orderId,
          errors: validation.errors,
        });
        return this.sendValidationError(res, validation);
      }

      logger.info('Verifying payment', { orderId });

      const result = await this.paymentService.verifyPayment(orderId);
      return res.status(200).json({
        success: true,
        data: {
          orderId: result.orderId,
          paid: result.paid,
          status: result.status,
        },
      });
    } catch (error: unknown) {
      return this.handlePaymentLookupError(
        req,
        res,
        error,
        'Payment verification error',
        'Failed to verify payment. Please try again later.',
      );
    }
  };

  getPaymentQr = async (req: Request, res: Response) => {
    try {
      const orderId = this.getOrderIdParam(req);
      const validation = this.validateOrderId(orderId);

      if (this.hasValidationError(validation)) {
        return this.sendValidationError(res, validation);
      }

      const payment = await this.paymentService.getPaymentByOrderId(orderId);

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
    } catch (error: unknown) {
      return this.handlePaymentLookupError(
        req,
        res,
        error,
        'Payment QR generation error',
        'Failed to generate QR code. Please try again later.',
      );
    }
  };

  checkBakongAccount = async (_req: Request, res: Response) => {
    try {
      const result = await this.paymentService.checkConfiguredBakongAccount();

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: unknown) {
      const message = this.getErrorMessage(error);

      logger.error('Bakong account check error', {
        error: message,
      });

      return res.status(500).json({
        success: false,
        message: message || 'Failed to check Bakong account',
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
    } catch (error: unknown) {
      const message = this.getErrorMessage(error);

      logger.error('KHQR decode error', {
        error: message,
      });

      return res.status(400).json({
        success: false,
        message: message || 'Failed to decode KHQR',
      });
    }
  };

  private getCreatePaymentInput(req: Request): CreatePaymentBody {
    const { orderId, amount, currency } = req.body as CreatePaymentBody;

    return {
      orderId,
      amount,
      currency,
    };
  }

  private getOrderIdParam(req: Request) {
    return req.params.orderId || '';
  }

  private validateCreatePaymentInput(input: CreatePaymentBody): ValidationResult {
    return PaymentValidator.validateCreatePayment(input.orderId || '', input.amount, input.currency || 'KHR');
  }

  private validateOrderId(orderId: string): ValidationResult {
    return PaymentValidator.validateVerifyPayment(orderId);
  }

  private toCreatePaymentCommand(input: CreatePaymentBody): CreatePaymentCommand {
    return {
      orderId: input.orderId || '',
      amount: Number(input.amount),
      currency: this.normalizeCurrency(input.currency),
    };
  }

  private hasValidationError(validation: ValidationResult) {
    return !validation.isValid;
  }

  private normalizeCurrency(currency?: string): PaymentCurrency {
    return (currency || 'KHR').toUpperCase() as PaymentCurrency;
  }

  private toSafePaymentResponse(payment: SafePaymentSource) {
    return {
      id: payment.id,
      orderId: payment.orderId,
      amount: payment.amount,
      currency: payment.currency,
      qrString: payment.qrString,
      status: payment.status,
      createdAt: payment.createdAt,
    };
  }

  private sendValidationError(res: Response, validation: ValidationResult) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: validation.errors,
    });
  }

  private handleCreatePaymentError(req: Request, res: Response, error: unknown) {
    const message = this.getErrorMessage(error);

    logger.error('Payment creation error', {
      orderId: (req.body as CreatePaymentBody).orderId,
      error: message,
    });

    if (message.includes('already exists')) {
      return res.status(409).json({
        success: false,
        message: 'Payment already exists for this order',
      });
    }

    if (this.isBakongError(message)) {
      return res.status(400).json({
        success: false,
        message,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to create payment. Please try again later.',
    });
  }

  private handlePaymentLookupError(
    req: Request,
    res: Response,
    error: unknown,
    logMessage: string,
    clientMessage: string,
  ) {
    const message = this.getErrorMessage(error);

    logger.error(logMessage, {
      orderId: req.params.orderId,
      error: message,
    });

    if (message.includes('not found')) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found for this order',
      });
    }

    return res.status(500).json({
      success: false,
      message: clientMessage,
    });
  }

  private isBakongError(message: string) {
    return message.includes('BAKONG_') || message.includes('KHQR') || message.includes('Bakong');
  }

  private getErrorMessage(error: unknown) {
    return error instanceof Error ? error.message : String(error);
  }
}
