// import PaymentModel from '../models/Payment.js';

// export class PaymentRepository {
//   async create(data: any) {
//     return await PaymentModel.create(data);
//   }

//   async findByOrderId(orderId: string) {
//     return await PaymentModel.findOne({ orderId });
//   }

//   async updateStatus(orderId: string, status: string) {
//     return await PaymentModel.findOneAndUpdate(
//       { orderId },
//       { status },
//       { new: true }
//     );
//   }

//   async saveBakongTx(orderId: string, bakongTxId: string) {
//     return await PaymentModel.findOneAndUpdate(
//       { orderId },
//       { bakongTxId },
//       { new: true }
//     );
//   }
// }