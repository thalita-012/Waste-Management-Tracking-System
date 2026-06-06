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
export declare class PaymentService {
    private paymentRepo;
    private notificationService;
    createBakongPayment(orderId: string, amount: number, currency?: PaymentCurrency): Promise<{
        id: number;
        orderId: string;
        amount: number;
        currency: string;
        qrString: string | null;
        khqrMd5: string | null;
        bakongTxId: string | null;
        status: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    verifyPayment(orderId: string, userId?: number): Promise<{
        orderId: string;
        paid: boolean;
        status: string;
        bakong: null;
        payment: {
            id: number;
            orderId: string;
            amount: number;
            currency: string;
            qrString: string | null;
            khqrMd5: string | null;
            bakongTxId: string | null;
            status: string;
            createdAt: Date;
            updatedAt: Date;
        };
        notification: import("../models/Notification.js").NotificationModel;
    } | {
        orderId: string;
        paid: boolean;
        status: string;
        bakong: BakongCheckResponse;
        payment: {
            id: number;
            orderId: string;
            amount: number;
            currency: string;
            qrString: string | null;
            khqrMd5: string | null;
            bakongTxId: string | null;
            status: string;
            createdAt: Date;
            updatedAt: Date;
        };
        notification: import("../models/Notification.js").NotificationModel | null;
    }>;
    getPaymentByOrderId(orderId: string): Promise<{
        id: number;
        orderId: string;
        amount: number;
        currency: string;
        qrString: string | null;
        khqrMd5: string | null;
        bakongTxId: string | null;
        status: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    checkConfiguredBakongAccount(): Promise<{
        accountId: string;
        result: unknown;
    }>;
    decodeKhqr(qrString: string): {
        isValid: boolean;
        decoded: unknown;
    };
    private generateKhqr;
    private checkBakongTransaction;
    private isPaidResponse;
    private getTransactionId;
    private refreshPendingPaymentQr;
    private normalizePaymentCurrency;
    private validateKhqrMerchantConfig;
    private limitKhqrText;
    private getDynamicPaymentFields;
}
export {};
//# sourceMappingURL=PaymentService.d.ts.map