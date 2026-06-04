// import axios from 'axios';
// import { PaymentRepository } from '../repositories/PaymentRepository.js';

// export class PaymentService {
//   private paymentRepo = new PaymentRepository();

//   async createBakongPayment(orderId: string, amount: number) {
//     const payload = {
//       merchantId: process.env.BAKONG_MERCHANT_ID,
//       amount,
//       currency: 'KHR',
//       reference: orderId,
//     };

//     const response = await axios.post(
//       process.env.BAKONG_API_URL as string,
//       payload,
//       {
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${process.env.BAKONG_API_KEY}`,
//         },
//       }
//     );

//     const qrString = response.data.qrString;

//     const payment = await this.paymentRepo.create({
//       orderId,
//       amount,
//       currency: 'KHR',
//       qrString,
//       status: 'PENDING',
//     });

//     return payment;
//   }

//   async verifyPayment(orderId: string) {
//     const payment = await this.paymentRepo.findByOrderId(orderId);

//     if (!payment) {
//       throw new Error('Payment not found');
//     }

//     const response = await axios.get(
//       `${process.env.BAKONG_API_URL}/check/${orderId}`,
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.BAKONG_API_KEY}`,
//         },
//       }
//     );

//     const isPaid = response.data.status === 'PAID';

//     if (isPaid) {
//       await this.paymentRepo.updateStatus(orderId, 'PAID');
//     }

//     return {
//       orderId,
//       paid: isPaid,
//     };
//   }
// }