export declare class PaymentRepository {
    create(data: {
        orderId: string;
        amount: number;
        currency: string;
        qrString?: string;
        khqrMd5?: string;
        status?: string;
    }): Promise<{
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
    findByOrderId(orderId: string): Promise<{
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
    } | null>;
    refreshQr(orderId: string, data: {
        amount: number;
        currency: string;
        qrString: string;
        khqrMd5: string;
    }): Promise<{
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
    markPaid(orderId: string, bakongTxId?: string): Promise<{
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
    markPaidConditional(orderId: string, expectedStatus: string, bakongTxId?: string): Promise<{
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
    saveBakongTx(orderId: string, bakongTxId: string): Promise<{
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
}
//# sourceMappingURL=PaymentRepository.d.ts.map