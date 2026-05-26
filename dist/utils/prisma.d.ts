type PaymentRecord = {
    id: string;
    orderId: string;
    amount: number;
    currency: string;
    qrString?: string;
    bakongTxId?: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
};
export declare const prisma: {
    readonly payment: {
        readonly create: ({ data }: {
            data: Omit<PaymentRecord, "id" | "createdAt" | "updatedAt">;
        }) => Promise<PaymentRecord>;
        readonly findUnique: ({ where }: {
            where: {
                orderId: string;
            };
        }) => Promise<PaymentRecord | null>;
        readonly update: ({ where, data }: {
            where: {
                orderId: string;
            };
            data: Partial<PaymentRecord>;
        }) => Promise<PaymentRecord>;
    };
};
export {};
//# sourceMappingURL=prisma.d.ts.map