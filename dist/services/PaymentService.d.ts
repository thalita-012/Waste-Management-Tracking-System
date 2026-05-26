export declare class PaymentService {
    private paymentRepo;
    createBakongPayment(orderId: string, amount: number): Promise<{
        id: string;
        orderId: string;
        amount: number;
        currency: string;
        qrString?: string;
        bakongTxId?: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    verifyPayment(orderId: string): Promise<{
        orderId: string;
        paid: boolean;
    }>;
}
//# sourceMappingURL=PaymentService.d.ts.map