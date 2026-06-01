<<<<<<< HEAD
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
=======
import { Document } from 'mongoose';
export interface IPayment extends Document {
    orderId: string;
    amount: number;
    currency: string;
    qrString?: string;
    bakongTxId?: string;
    status: 'PENDING' | 'PAID' | 'FAILED';
    createdAt: Date;
}
declare const _default: any;
export default _default;
>>>>>>> b7808adb37a07e5f45a60d6aaf8cba3683e41758
//# sourceMappingURL=Payment.d.ts.map