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
        createdAt: Date;
        updatedAt: Date;
        orderId: string;
        amount: number;
        currency: string;
        qrString: string | null;
        khqrMd5: string | null;
        bakongTxId: string | null;
        status: string;
    }>;
    findByOrderId(orderId: string): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        orderId: string;
        amount: number;
        currency: string;
        qrString: string | null;
        khqrMd5: string | null;
        bakongTxId: string | null;
        status: string;
    }>;
    refreshQr(orderId: string, data: {
        amount: number;
        currency: string;
        qrString: string;
        khqrMd5: string;
    }): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        orderId: string;
        amount: number;
        currency: string;
        qrString: string | null;
        khqrMd5: string | null;
        bakongTxId: string | null;
        status: string;
    }>;
    markPaid(orderId: string, bakongTxId?: string): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        orderId: string;
        amount: number;
        currency: string;
        qrString: string | null;
        khqrMd5: string | null;
        bakongTxId: string | null;
        status: string;
    }>;
    markPaidConditional(orderId: string, expectedStatus: string, bakongTxId?: string): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        orderId: string;
        amount: number;
        currency: string;
        qrString: string | null;
        khqrMd5: string | null;
        bakongTxId: string | null;
        status: string;
    }>;
    saveBakongTx(orderId: string, bakongTxId: string): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        orderId: string;
        amount: number;
        currency: string;
        qrString: string | null;
        khqrMd5: string | null;
        bakongTxId: string | null;
        status: string;
    }>;
}
