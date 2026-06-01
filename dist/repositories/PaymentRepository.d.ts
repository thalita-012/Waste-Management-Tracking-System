export declare class PaymentRepository {
<<<<<<< HEAD
    create(data: {
=======
    create(data: any): Promise<{
        id: string;
>>>>>>> b7808adb37a07e5f45a60d6aaf8cba3683e41758
        orderId: string;
        amount: number;
        currency: string;
        qrString?: string;
<<<<<<< HEAD
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
    updateStatus(orderId: string, status: string): Promise<{
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
=======
        bakongTxId?: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findByOrderId(orderId: string): Promise<{
        id: string;
        orderId: string;
        amount: number;
        currency: string;
        qrString?: string;
        bakongTxId?: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    updateStatus(orderId: string, status: string): Promise<{
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
    saveBakongTx(orderId: string, bakongTxId: string): Promise<{
        id: string;
        orderId: string;
        amount: number;
        currency: string;
        qrString?: string;
        bakongTxId?: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
>>>>>>> b7808adb37a07e5f45a60d6aaf8cba3683e41758
    }>;
}
//# sourceMappingURL=PaymentRepository.d.ts.map