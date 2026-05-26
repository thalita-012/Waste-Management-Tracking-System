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
//# sourceMappingURL=Payment.d.ts.map