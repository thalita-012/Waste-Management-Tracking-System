import { env, getRequiredConfig } from '../config/env.js';
import { PaymentRepository } from '../repositories/PaymentRepository.js';
import { NotificationService } from './NotificationService.js';
import { logger } from '../utils/logger.js';
import { createRequire } from 'module';

// This is the ONLY import method - using createRequire
const require = createRequire(import.meta.url);
const BakongModule = require('bakong-khqr');

const BakongKHQR = BakongModule.BakongKHQR || BakongModule.default || BakongModule;
const IndividualInfo = BakongModule.IndividualInfo;
const MerchantInfo = BakongModule.MerchantInfo;
const khqrData = BakongModule.khqrData;

// Debug log - check Render logs after deploy
console.log('=== Bakong Module Loaded ===');
console.log('BakongKHQR type:', typeof BakongKHQR);
console.log('Is constructor?', typeof BakongKHQR === 'function');

type KhqrGenerateData = {
  qr: string;
  md5: string;
};

type BakongCheckResponse = {
  responseCode?: number;
  responseMessage?: string;
  errorCode?: number;
  message?: string;
  data?: {
    status?: string;
    hash?: string;
    transactionHash?: string;
    bakongTxId?: string;
    md5?: string;
    amount?: number;
  };
};

type PaymentCurrency = 'KHR' | 'USD';

type PaymentRecord = {
  orderId: string;
  amount: number;
  currency: string;
  status: string;
};

export class PaymentService {
  private paymentRepo = new PaymentRepository();
  private notificationService = new NotificationService();

  async createBakongPayment(orderId: string, amount: number, currency: PaymentCurrency = 'KHR') {
    if (!orderId || !amount) {
      throw new Error('orderId and amount are required');
    }

    const existingPayment = await this.paymentRepo.findByOrderId(orderId);
    if (existingPayment) {
      if (existingPayment.status === 'PENDING') {
        logger.info('Payment already exists for orderId, refreshing pending QR', { orderId });
        return await this.refreshPendingPaymentQr({
          orderId,
          amount,
          currency,
          status: existingPayment.status,
        });
      }

      logger.info('Payment already exists for orderId, returning existing non-pending payment', { orderId });
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
    return payment;
  }

  async verifyPayment(orderId: string, userId = 1) {
    const payment = await this.paymentRepo.findByOrderId(orderId);

    if (!payment) {
      logger.warn('Payment not found', { orderId });
      throw new Error('Payment not found');
    }

    if (!payment.khqrMd5) {
      logger.error('Payment has no KHQR MD5 value', { orderId, paymentId: payment.id });
      throw new Error('Payment does not have a KHQR MD5 value');
    }

    if (payment.status === 'PAID') {
      logger.info('Payment already paid, skipping verification', { orderId });
      const notification = this.notificationService.sendPaymentSuccessNotification(
        userId,
        payment.orderId,
        payment.amount,
        payment.currency,
      );

      return {
        orderId,
        paid: true,
        status: payment.status,
        bakong: null,
        payment,
        notification,
      };
    }

    logger.info('Checking transaction status with Bakong', { orderId });
    const bakongStatus = await this.checkBakongTransaction(payment.khqrMd5);
    const paid = this.isPaidResponse(bakongStatus);
    const transactionId = this.getTransactionId(bakongStatus);

    let updatedPayment = payment;
    if (paid && payment.status === 'PENDING') {
      logger.info('Marking payment as PAID', { orderId, transactionId });
      updatedPayment = await this.paymentRepo.markPaidConditional(orderId, 'PENDING', transactionId);
    }

    const notification = paid
      ? this.notificationService.sendPaymentSuccessNotification(
          userId,
          updatedPayment.orderId,
          updatedPayment.amount,
          updatedPayment.currency,
        )
      : null;

    return {
      orderId,
      paid,
      status: updatedPayment.status,
      bakong: bakongStatus,
      payment: updatedPayment,
      notification,
    };
  }

  async getPaymentByOrderId(orderId: string) {
    const payment = await this.paymentRepo.findByOrderId(orderId);

    if (!payment) {
      logger.warn('Payment not found', { orderId });
      throw new Error('Payment not found');
    }

    if (payment.status === 'PENDING') {
      logger.info('Refreshing pending QR before returning payment QR', { orderId });
      return await this.refreshPendingPaymentQr(payment);
    }

    return payment;
  }

  async checkConfiguredBakongAccount() {
    const baseUrl = getRequiredConfig('BAKONG_API_BASE_URL', env.bakong.apiBaseUrl).replace(/\/$/, '');
    const accountId = getRequiredConfig('BAKONG_ACCOUNT_ID', env.bakong.accountId);
    const checkUrl = `${baseUrl}/v1/check_account_exist`;

    const result = await BakongKHQR.checkBakongAccount(checkUrl, accountId);

    return {
      accountId,
      result,
    };
  }

  decodeKhqr(qrString: string) {
    if (!qrString) {
      throw new Error('qrString is required');
    }

    return {
      isValid: BakongKHQR.verify(qrString).isValid,
      decoded: BakongKHQR.decode(qrString),
    };
  }

  private generateKhqr(orderId: string, amount: number, currency: PaymentCurrency) {
    const bakongAccountId = getRequiredConfig('BAKONG_ACCOUNT_ID', env.bakong.accountId);
    const merchantName = this.limitKhqrText(getRequiredConfig('BAKONG_MERCHANT_NAME', env.bakong.merchantName), 25);
    const merchantCity = this.limitKhqrText(env.bakong.merchantCity, 15);
    const currencyValue = currency === 'USD' ? khqrData.currency.usd : khqrData.currency.khr;
    const accountInformation = env.bakong.accountInformation;
    const merchantId = env.bakong.merchantId;
    const acquiringBank = env.bakong.acquiringBank;
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
      ? khqr.generateMerchant(
          new MerchantInfo(
            bakongAccountId,
            merchantName,
            merchantCity,
            merchantId as string,
            acquiringBank as string,
            optionalData,
          ),
        )
      : khqr.generateIndividual(new IndividualInfo(bakongAccountId, merchantName, merchantCity, optionalData));

    if (response.status.errorCode || !response.data) {
      logger.error('KHQR generation failed', { orderId, error: response.status.message });
      throw new Error(response.status.message || 'Failed to generate KHQR');
    }

    return response.data as KhqrGenerateData;
  }

  private async checkBakongTransaction(md5: string) {
    const baseUrl = getRequiredConfig('BAKONG_API_BASE_URL', env.bakong.apiBaseUrl).replace(/\/$/, '');
    const token = getRequiredConfig('BAKONG_API_TOKEN', env.bakong.apiToken);

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

      const data = (await response.json()) as BakongCheckResponse;

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
    } catch (error: any) {
      logger.error('Bakong API request failed', { md5, error: error.message });
      throw error;
    }
  }

  private isPaidResponse(response: BakongCheckResponse) {
    return response.responseCode === 0 || response.data?.status === 'SUCCESS' || response.data?.status === 'PAID';
  }

  private getTransactionId(response: BakongCheckResponse) {
    return response.data?.hash || response.data?.transactionHash || response.data?.bakongTxId || response.data?.md5;
  }

  private async refreshPendingPaymentQr(payment: PaymentRecord) {
    const currency = this.normalizePaymentCurrency(payment.currency);
    const khqrData = this.generateKhqr(payment.orderId, payment.amount, currency);

    return await this.paymentRepo.refreshQr(payment.orderId, {
      amount: payment.amount,
      currency,
      qrString: khqrData.qr,
      khqrMd5: khqrData.md5,
    });
  }

  private normalizePaymentCurrency(currency: string): PaymentCurrency {
    return currency.toUpperCase() === 'USD' ? 'USD' : 'KHR';
  }

  private validateKhqrMerchantConfig(merchantId?: string, acquiringBank?: string) {
    if ((merchantId && !acquiringBank) || (!merchantId && acquiringBank)) {
      throw new Error(
        'BAKONG_MERCHANT_ID and BAKONG_ACQUIRING_BANK must both be set for merchant QR, or both be empty for individual QR',
      );
    }
  }

  private limitKhqrText(value: string, maxLength: number) {
    return value.trim().slice(0, maxLength);
  }

  private getDynamicPaymentFields(amount: number) {
    return {
      amount,
      expirationTimestamp: Date.now() + env.bakong.qrExpirationMinutes * 60 * 1000,
    };
  }
}