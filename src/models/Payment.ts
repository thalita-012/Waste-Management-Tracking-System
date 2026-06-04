// import mongoose, { Schema, Document } from 'mongoose';

// export interface IPayment extends Document {
//   orderId: string;
//   amount: number;
//   currency: string;
//   qrString?: string;
//   bakongTxId?: string;
//   status: 'PENDING' | 'PAID' | 'FAILED';
//   createdAt: Date;
// }

// const PaymentSchema = new Schema<IPayment>(
//   {
//     orderId: {
//       type: String,
//       required: true,
//     },
//     amount: {
//       type: Number,
//       required: true,
//     },
//     currency: {
//       type: String,
//       default: 'KHR',
//     },
//     qrString: String,
//     bakongTxId: String,
//     status: {
//       type: String,
//       enum: ['PENDING', 'PAID', 'FAILED'],
//       default: 'PENDING',
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// export default mongoose.model<IPayment>('Payment', PaymentSchema);