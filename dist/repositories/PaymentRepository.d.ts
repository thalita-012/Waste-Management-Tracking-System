export declare class PaymentRepository {
    create(data: any): Promise<{
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
    }>;
}
//# sourceMappingURL=PaymentRepository.d.ts.map