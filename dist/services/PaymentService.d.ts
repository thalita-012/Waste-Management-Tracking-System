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
export declare class PaymentService {
    private paymentRepo;
    createBakongPayment(orderId: string, amount: number, currency?: 'KHR' | 'USD'): Promise<{
        orderId: string;
        amount: number;
        currency: string;
        qrString: string | null;
        khqrMd5: string | null;
        bakongTxId: string | null;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    }>;
    verifyPayment(orderId: string): Promise<{
        orderId: string;
        paid: boolean;
        status: string;
        bakong: null;
        payment: {
            orderId: string;
            amount: number;
            currency: string;
            qrString: string | null;
            khqrMd5: string | null;
            bakongTxId: string | null;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            id: number;
        };
    } | {
        orderId: string;
        paid: boolean;
        status: string;
        bakong: BakongCheckResponse;
        payment: {
            orderId: string;
            amount: number;
            currency: string;
            qrString: string | null;
            khqrMd5: string | null;
            bakongTxId: string | null;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            id: number;
        };
    }>;
    getPaymentByOrderId(orderId: string): Promise<{
        orderId: string;
        amount: number;
        currency: string;
        qrString: string | null;
        khqrMd5: string | null;
        bakongTxId: string | null;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
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
    private getRequiredEnv;
    private getOptionalEnv;
    private validateKhqrMerchantConfig;
    private limitKhqrText;
    private getDynamicPaymentFields;
}
export {};
//# sourceMappingURL=PaymentService.d.ts.map