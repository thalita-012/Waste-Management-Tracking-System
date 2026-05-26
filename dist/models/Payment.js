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
//# sourceMappingURL=Payment.js.map