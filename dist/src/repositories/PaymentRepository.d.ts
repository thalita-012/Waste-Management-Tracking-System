export declare class PaymentRepository {
    create(data: {
        orderId: string;
        amount: number;
        currency: string;
        qrString?: string;
        khqrMd5?: string;
        status?: string;
    }): Promise<{
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
    findByOrderId(orderId: string): Promise<{
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
    } | null>;
    refreshQr(orderId: string, data: {
        amount: number;
        currency: string;
        qrString: string;
        khqrMd5: string;
    }): Promise<{
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
    markPaid(orderId: string, bakongTxId?: string): Promise<{
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
    markPaidConditional(orderId: string, expectedStatus: string, bakongTxId?: string): Promise<{
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
    saveBakongTx(orderId: string, bakongTxId: string): Promise<{
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
}
//# sourceMappingURL=PaymentRepository.d.ts.map