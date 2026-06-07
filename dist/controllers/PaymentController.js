"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const qrcode_1 = __importDefault(require("qrcode"));
const PaymentService_js_1 = require("../services/PaymentService.js");
const env_js_1 = require("../config/env.js");
const validators_js_1 = require("../utils/validators.js");
const logger_js_1 = require("../utils/logger.js");
class PaymentController {
    constructor(paymentService = new PaymentService_js_1.PaymentService()) {
        this.paymentService = paymentService;
        this.createPayment = async (req, res) => {
            try {
                const input = this.getCreatePaymentInput(req);
                const validation = this.validateCreatePaymentInput(input);
                if (this.hasValidationError(validation)) {
                    logger_js_1.logger.warn('Payment creation validation failed', {
                        orderId: input.orderId,
                        errors: validation.errors,
                    });
                    return this.sendValidationError(res, validation);
                }
                const command = this.toCreatePaymentCommand(input);
                logger_js_1.logger.info('Creating payment', command);
                const payment = await this.paymentService.createBakongPayment(command.orderId, command.amount, command.currency);
                return res.status(201).json({
                    success: true,
                    data: this.toSafePaymentResponse(payment),
                });
            }
            catch (error) {
                return this.handleCreatePaymentError(req, res, error);
            }
        };
        this.verifyPayment = async (req, res) => {
            try {
                const orderId = this.getOrderIdParam(req);
                const validation = this.validateOrderId(orderId);
                if (this.hasValidationError(validation)) {
                    logger_js_1.logger.warn('Payment verification validation failed', {
                        orderId,
                        errors: validation.errors,
                    });
                    return this.sendValidationError(res, validation);
                }
                logger_js_1.logger.info('Verifying payment', { orderId });
                const userId = this.getUserId(req);
                const result = await this.paymentService.verifyPayment(orderId, userId);
                return res.status(200).json({
                    success: true,
                    data: {
                        orderId: result.orderId,
                        paid: result.paid,
                        status: result.status,
                        notification: result.notification,
                    },
                });
            }
            catch (error) {
                return this.handlePaymentLookupError(req, res, error, 'Payment verification error', 'Failed to verify payment. Please try again later.');
            }
        };
        this.getPaymentQr = async (req, res) => {
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
                const qrPng = await qrcode_1.default.toBuffer(payment.qrString, {
                    type: 'png',
                    errorCorrectionLevel: 'M',
                    width: 512,
                    margin: 2,
                });
                res.setHeader('Content-Type', 'image/png');
                res.setHeader('Cache-Control', 'no-store');
                return res.status(200).send(qrPng);
            }
            catch (error) {
                return this.handlePaymentLookupError(req, res, error, 'Payment QR generation error', 'Failed to generate QR code. Please try again later.');
            }
        };
        this.checkBakongAccount = async (_req, res) => {
            try {
                const result = await this.paymentService.checkConfiguredBakongAccount();
                return res.status(200).json({
                    success: true,
                    data: result,
                });
            }
            catch (error) {
                const message = this.getErrorMessage(error);
                logger_js_1.logger.error('Bakong account check error', {
                    error: message,
                });
                return res.status(500).json({
                    success: false,
                    message: message || 'Failed to check Bakong account',
                });
            }
        };
        this.decodeKhqr = async (req, res) => {
            try {
                const { qrString } = req.body;
                const result = this.paymentService.decodeKhqr(qrString);
                return res.status(200).json({
                    success: true,
                    data: result,
                });
            }
            catch (error) {
                const message = this.getErrorMessage(error);
                logger_js_1.logger.error('KHQR decode error', {
                    error: message,
                });
                return res.status(400).json({
                    success: false,
                    message: message || 'Failed to decode KHQR',
                });
            }
        };
    }
    getCreatePaymentInput(req) {
        const { orderId, amount, currency } = req.body;
        return {
            orderId,
            amount,
            currency,
        };
    }
    getOrderIdParam(req) {
        return req.params.orderId || '';
    }
    getUserId(req) {
        const rawUserId = req.query.userId || req.body?.userId;
        const userId = Number(rawUserId);
        return Number.isFinite(userId) && userId > 0 ? userId : 1;
    }
    validateCreatePaymentInput(input) {
        return validators_js_1.PaymentValidator.validateCreatePayment(input.orderId || '', input.amount, input.currency || 'KHR');
    }
    validateOrderId(orderId) {
        return validators_js_1.PaymentValidator.validateVerifyPayment(orderId);
    }
    toCreatePaymentCommand(input) {
        return {
            orderId: input.orderId || '',
            amount: Number(input.amount),
            currency: this.normalizeCurrency(input.currency),
        };
    }
    hasValidationError(validation) {
        return !validation.isValid;
    }
    normalizeCurrency(currency) {
        return (currency || 'KHR').toUpperCase();
    }
    toSafePaymentResponse(payment) {
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
    sendValidationError(res, validation) {
        return res.status(400).json({
            success: false,
            message: 'Validation error',
            errors: validation.errors,
        });
    }
    handleCreatePaymentError(req, res, error) {
        const message = this.getErrorMessage(error);
        logger_js_1.logger.error('Payment creation error', {
            orderId: req.body.orderId,
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
                ...(env_js_1.env.nodeEnv !== 'production' ? { error: message } : {}),
            });
        }
        return res.status(500).json({
            success: false,
            message: 'Failed to create payment. Please try again later.',
            ...(env_js_1.env.nodeEnv !== 'production' ? { error: message } : {}),
        });
    }
    handlePaymentLookupError(req, res, error, logMessage, clientMessage) {
        const message = this.getErrorMessage(error);
        logger_js_1.logger.error(logMessage, {
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
    isBakongError(message) {
        return message.includes('BAKONG_') || message.includes('KHQR') || message.includes('Bakong');
    }
    getErrorMessage(error) {
        return error instanceof Error ? error.message : String(error);
    }
}
exports.PaymentController = PaymentController;
//# sourceMappingURL=PaymentController.js.map