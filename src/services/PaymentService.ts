import { createRequire } from 'node:module';
import { PaymentRepository } from '../repositories/PaymentRepository.js';
import { logger } from '../utils/logger.js';

const require = createRequire(import.meta.url);
const { BakongKHQR, IndividualInfo, MerchantInfo, khqrData } = require('bakong-khqr') as {
  BakongKHQR: {
    new (): {
    generateMerchant: (merchantInfo: unknown) => {
      status: { errorCode: number | null; message: string | null };
      data: unknown;
    };
    generateIndividual: (individualInfo: unknown) => {
      status: { errorCode: number | null; message: string | null };
      data: unknown;
    };
    };
    verify: (qr: string) => { isValid: boolean };
    decode: (qr: string) => unknown;
    checkBakongAccount: (url: string, accountId: string) => Promise<unknown>;
  };
  IndividualInfo: new (
    bakongAccountId: string,
    merchantName: string,
    merchantCity: string,
    optionalData: Record<string, unknown>,
  ) => unknown;
  MerchantInfo: new (
    bakongAccountId: string,
    merchantName: string,
    merchantCity: string,
    merchantId: string,
    acquiringBank: string,
    optionalData: Record<string, unknown>,
  ) => unknown;
  khqrData: { currency: { khr: number; usd: number } };
};

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

export class PaymentService {
  private paymentRepo = new PaymentRepository();

  async createBakongPayment(orderId: string, amount: number, currency: 'KHR' | 'USD' = 'KHR') {
    if (!orderId || !amount) {
      throw new Error('orderId and amount are required');
    }

    // ✅ STEP 4: Check if payment already exists (idempotency)
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
    return payment;
  }

  async verifyPayment(orderId: string) {
    const payment = await this.paymentRepo.findByOrderId(orderId);

    if (!payment) {
      logger.warn('Payment not found', { orderId });
      throw new Error('Payment not found');
    }

    if (!payment.khqrMd5) {
      logger.error('Payment has no KHQR MD5 value', { orderId, paymentId: payment.id });
      throw new Error('Payment does not have a KHQR MD5 value');
    }

    // ✅ Don't verify if already paid
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

    // ✅ STEP 3: Fix race condition with conditional update
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

  async getPaymentByOrderId(orderId: string) {
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

  decodeKhqr(qrString: string) {
    if (!qrString) {
      throw new Error('qrString is required');
    }

    return {
      isValid: BakongKHQR.verify(qrString).isValid,
      decoded: BakongKHQR.decode(qrString),
    };
  }

  private generateKhqr(orderId: string, amount: number, currency: 'KHR' | 'USD') {
    const bakongAccountId = this.getRequiredEnv('BAKONG_ACCOUNT_ID');
    const merchantName = this.limitKhqrText(this.getRequiredEnv('BAKONG_MERCHANT_NAME'), 25);
    const merchantCity = this.limitKhqrText(process.env.BAKONG_MERCHANT_CITY || 'Phnom Penh', 15);
    const currencyValue = currency === 'USD' ? khqrData.currency.usd : khqrData.currency.khr;
    const merchantId = process.env.BAKONG_MERCHANT_ID;
    const acquiringBank = process.env.BAKONG_ACQUIRING_BANK;
    const isMerchantQr = Boolean(merchantId && acquiringBank);

    const optionalData = {
      currency: currencyValue,
      accountInformation: process.env.BAKONG_ACCOUNT_INFORMATION,
      billNumber: this.limitKhqrText(orderId, 25),
      storeLabel: merchantName,
      terminalLabel: 'Backend',
      merchantCategoryCode: '5999',
      ...(isMerchantQr ? this.getDynamicPaymentFields(amount) : {}),
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

  private getRequiredEnv(name: string) {
    const value = process.env[name];

    if (!value) {
      logger.error('Missing required environment variable', { variable: name });
      throw new Error(`${name} is required`);
    }

    return value;
  }

  private limitKhqrText(value: string, maxLength: number) {
    return value.trim().slice(0, maxLength);
  }

  private getDynamicPaymentFields(amount: number) {
    const expirationMinutes = Number(process.env.BAKONG_QR_EXPIRATION_MINUTES || 5);

    return {
      amount,
      expirationTimestamp: Date.now() + expirationMinutes * 60 * 1000,
    };
  }
}
