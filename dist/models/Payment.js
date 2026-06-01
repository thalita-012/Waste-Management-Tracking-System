<<<<<<< HEAD
export {};
=======
import mongoose, { Schema, Document } from 'mongoose';
const PaymentSchema = new Schema({
    orderId: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    currency: {
        type: String,
        default: 'KHR',
    },
    qrString: String,
    bakongTxId: String,
    status: {
        type: String,
        enum: ['PENDING', 'PAID', 'FAILED'],
        default: 'PENDING',
    },
}, {
    timestamps: true,
});
export default mongoose.model('Payment', PaymentSchema);
>>>>>>> b7808adb37a07e5f45a60d6aaf8cba3683e41758
//# sourceMappingURL=Payment.js.map