<<<<<<< HEAD
import { createRequire } from 'node:module';
import { PaymentRepository } from '../repositories/PaymentRepository.js';
import { logger } from '../utils/logger.js';
const require = createRequire(import.meta.url);
const { BakongKHQR, IndividualInfo, MerchantInfo, khqrData } = require('bakong-khqr');
=======
import { PaymentRepository } from "../repositories/PaymentRepository";
>>>>>>> b7808adb37a07e5f45a60d6aaf8cba3683e41758
export class PaymentService {
    constructor() {
        this.paymentRepo = new PaymentRepository();
    }
<<<<<<< HEAD
    async createBakongPayment(orderId, amount, currency = 'KHR') {
        if (!orderId || !amount) {
            throw new Error('orderId and amount are required');
        }
        // Check if payment already exists (idempotency)
        const existingPayment = await this.paymentRepo.findByOrderId(orderId);
        if (existingPayment) {
            logger.info('Payment already exists for orderId, returning existing', { orderId });
            return existingPayment;
        }
        logger.info('Generating KHQR for new payment', { orderId, amount, currency });
        const khqrData = this.generateKhqr(orderId, amount, currency);
        const payment = await this.paymentRepo.create({
            orderId,
            amount,
            currency,
            qrString: khqrData.qr,
            khqrMd5: khqrData.md5,
            status: 'PENDING',
        });
        logger.info('Payment created successfully', { orderId, paymentId: payment.id });
=======
    async createBakongPayment(orderId, amount) {
        const apiUrl = process.env.BAKONG_API_URL;
        const apiKey = process.env.BAKONG_API_KEY;
        const merchantId = process.env.BAKONG_MERCHANT_ID;
        if (!apiUrl || !apiKey || !merchantId) {
            throw new Error("Missing Bakong env vars: BAKONG_API_URL, BAKONG_API_KEY, BAKONG_MERCHANT_ID");
        }
        // Example payload
        const payload = {
            merchantId,
            amount,
            currency: 'KHR',
            reference: orderId,
        };
        // Call Bakong API
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify(payload),
        });
        if (!response.ok) {
            const errorBody = await response.text().catch(() => "");
            throw new Error(`Bakong create payment failed (${response.status}): ${errorBody}`);
        }
        const responseBody = await response.json();
        const qrString = typeof responseBody === "object" && responseBody !== null && "qrString" in responseBody
            ? responseBody.qrString
            : undefined;
        if (typeof qrString !== "string" || qrString.length === 0) {
            throw new Error("Bakong response missing qrString");
        }
        // Save payment record
        const payment = await this.paymentRepo.create({
            orderId,
            amount,
            currency: 'KHR',
            qrString,
            status: 'PENDING',
        });
>>>>>>> b7808adb37a07e5f45a60d6aaf8cba3683e41758
        return payment;
    }
    async verifyPayment(orderId) {
        const payment = await this.paymentRepo.findByOrderId(orderId);
        if (!payment) {
<<<<<<< HEAD
            logger.warn('Payment not found', { orderId });
            throw new Error('Payment not found');
        }
        if (!payment.khqrMd5) {
            logger.error('Payment has no KHQR MD5 value', { orderId, paymentId: payment.id });
            throw new Error('Payment does not have a KHQR MD5 value');
        }
        // Don't verify if already paid
        if (payment.status === 'PAID') {
            logger.info('Payment already paid, skipping verification', { orderId });
            return {
                orderId,
                paid: true,
                status: payment.status,
                bakong: null,
                payment,
            };
        }
        logger.info('Checking transaction status with Bakong', { orderId });
        const bakongStatus = await this.checkBakongTransaction(payment.khqrMd5);
        const paid = this.isPaidResponse(bakongStatus);
        const transactionId = this.getTransactionId(bakongStatus);
        // Fix race condition with conditional update
        // Only update if still PENDING to prevent duplicate marking
        let updatedPayment = payment;
        if (paid && payment.status === 'PENDING') {
            logger.info('Marking payment as PAID', { orderId, transactionId });
            updatedPayment = await this.paymentRepo.markPaidConditional(orderId, 'PENDING', transactionId);
        }
        return {
            orderId,
            paid,
            status: updatedPayment.status,
            bakong: bakongStatus,
            payment: updatedPayment,
        };
    }
    async getPaymentByOrderId(orderId) {
        const payment = await this.paymentRepo.findByOrderId(orderId);
        if (!payment) {
            logger.warn('Payment not found', { orderId });
            throw new Error('Payment not found');
        }
        return payment;
    }
    async checkConfiguredBakongAccount() {
        const baseUrl = this.getRequiredEnv('BAKONG_API_BASE_URL').replace(/\/$/, '');
        const accountId = this.getRequiredEnv('BAKONG_ACCOUNT_ID');
        const checkUrl = `${baseUrl}/v1/check_account_exist`;
        const result = await BakongKHQR.checkBakongAccount(checkUrl, accountId);
        return {
            accountId,
            result,
        };
    }
    decodeKhqr(qrString) {
        if (!qrString) {
            throw new Error('qrString is required');
        }
        return {
            isValid: BakongKHQR.verify(qrString).isValid,
            decoded: BakongKHQR.decode(qrString),
        };
    }
    generateKhqr(orderId, amount, currency) {
        const bakongAccountId = this.getRequiredEnv('BAKONG_ACCOUNT_ID');
        const merchantName = this.limitKhqrText(this.getRequiredEnv('BAKONG_MERCHANT_NAME'), 25);
        const merchantCity = this.limitKhqrText(process.env.BAKONG_MERCHANT_CITY || 'Phnom Penh', 15);
        const currencyValue = currency === 'USD' ? khqrData.currency.usd : khqrData.currency.khr;
        const accountInformation = this.getOptionalEnv('BAKONG_ACCOUNT_INFORMATION');
        const merchantId = this.getOptionalEnv('BAKONG_MERCHANT_ID');
        const acquiringBank = this.getOptionalEnv('BAKONG_ACQUIRING_BANK');
        this.validateKhqrMerchantConfig(merchantId, acquiringBank);
        const isMerchantQr = Boolean(merchantId && acquiringBank);
        const optionalData = {
            currency: currencyValue,
            accountInformation,
            billNumber: this.limitKhqrText(orderId, 25),
            storeLabel: merchantName,
            terminalLabel: 'Backend',
            merchantCategoryCode: '5999',
            ...this.getDynamicPaymentFields(amount),
        };
        const khqr = new BakongKHQR();
        const response = isMerchantQr
            ? khqr.generateMerchant(new MerchantInfo(bakongAccountId, merchantName, merchantCity, merchantId, acquiringBank, optionalData))
            : khqr.generateIndividual(new IndividualInfo(bakongAccountId, merchantName, merchantCity, optionalData));
        if (response.status.errorCode || !response.data) {
            logger.error('KHQR generation failed', { orderId, error: response.status.message });
            throw new Error(response.status.message || 'Failed to generate KHQR');
        }
        return response.data;
    }
    async checkBakongTransaction(md5) {
        const baseUrl = this.getRequiredEnv('BAKONG_API_BASE_URL').replace(/\/$/, '');
        const token = this.getRequiredEnv('BAKONG_API_TOKEN');
        logger.debug('Checking Bakong transaction', { md5 });
        try {
            const response = await fetch(`${baseUrl}/v1/check_transaction_by_md5`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ md5 }),
            });
            const data = (await response.json());
            if (!response.ok) {
                logger.error('Bakong API error', {
                    md5,
                    status: response.status,
                    message: data.message || data.responseMessage,
                });
                throw new Error(data.message || data.responseMessage || 'Bakong transaction check failed');
            }
            logger.debug('Bakong transaction check successful', { md5, responseCode: data.responseCode });
            return data;
        }
        catch (error) {
            logger.error('Bakong API request failed', { md5, error: error.message });
            throw error;
        }
    }
    isPaidResponse(response) {
        return response.responseCode === 0 || response.data?.status === 'SUCCESS' || response.data?.status === 'PAID';
    }
    getTransactionId(response) {
        return response.data?.hash || response.data?.transactionHash || response.data?.bakongTxId || response.data?.md5;
    }
    getRequiredEnv(name) {
        const value = this.getOptionalEnv(name);
        if (!value) {
            logger.error('Missing required environment variable', { variable: name });
            throw new Error(`${name} is required`);
        }
        return value;
    }
    getOptionalEnv(name) {
        return process.env[name]?.trim() || undefined;
    }
    validateKhqrMerchantConfig(merchantId, acquiringBank) {
        if ((merchantId && !acquiringBank) || (!merchantId && acquiringBank)) {
            throw new Error('BAKONG_MERCHANT_ID and BAKONG_ACQUIRING_BANK must both be set for merchant QR, or both be empty for individual QR');
        }
    }
    limitKhqrText(value, maxLength) {
        return value.trim().slice(0, maxLength);
    }
    getDynamicPaymentFields(amount) {
        const expirationMinutes = Number(process.env.BAKONG_QR_EXPIRATION_MINUTES || 5);
        return {
            amount,
            expirationTimestamp: Date.now() + expirationMinutes * 60 * 1000,
=======
            throw new Error('Payment not found');
        }
        const apiUrl = process.env.BAKONG_API_URL;
        const apiKey = process.env.BAKONG_API_KEY;
        if (!apiUrl || !apiKey) {
            throw new Error("Missing Bakong env vars: BAKONG_API_URL, BAKONG_API_KEY");
        }
        // Example verification request
        const response = await fetch(`${apiUrl}/check/${encodeURIComponent(orderId)}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${apiKey}`,
            },
        });
        if (!response.ok) {
            const errorBody = await response.text().catch(() => "");
            throw new Error(`Bakong verify payment failed (${response.status}): ${errorBody}`);
        }
        const responseBody = await response.json();
        const status = typeof responseBody === "object" && responseBody !== null && "status" in responseBody
            ? responseBody.status
            : undefined;
        const isPaid = status === "PAID";
        if (isPaid) {
            await this.paymentRepo.updateStatus(orderId, 'PAID');
        }
        return {
            orderId,
            paid: isPaid,
>>>>>>> b7808adb37a07e5f45a60d6aaf8cba3683e41758
        };
    }
}
//# sourceMappingURL=PaymentService.js.map