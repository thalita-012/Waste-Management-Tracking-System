<<<<<<< HEAD
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
export declare const prisma: PrismaClient<{
    adapter: PrismaPg;
}, never, import("@prisma/client/runtime/client").DefaultArgs>;
=======
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
>>>>>>> b7808adb37a07e5f45a60d6aaf8cba3683e41758
//# sourceMappingURL=prisma.d.ts.map