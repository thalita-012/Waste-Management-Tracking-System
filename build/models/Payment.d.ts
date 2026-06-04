export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED';
export type Payment = {
    id: number;
    orderId: string;
    amount: number;
    currency: string;
    qrString: string | null;
    khqrMd5: string | null;
    bakongTxId: string | null;
    status: PaymentStatus;
    createdAt: Date;
    updatedAt: Date;
};
//# sourceMappingURL=Payment.d.ts.map