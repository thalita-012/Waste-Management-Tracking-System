import { prisma } from "../utils/prisma.js";

export class PaymentRepository {
  async create(data: {
    orderId: string;
    amount: number;
    currency: string;
    qrString?: string;
    khqrMd5?: string;
    status?: string;
  }) {
    return await prisma.payment.create({
      data,
    });
  }

  async findByOrderId(orderId: string) {
    return await prisma.payment.findUnique({
      where: {
        orderId,
      },
    });
  }

//   async updateStatus(orderId: string, status: string) {
//     return await PaymentModel.findOneAndUpdate(
//       { orderId },
//       { status },
//       { new: true }
//     );
//   }

  async refreshQr(
    orderId: string,
    data: {
      amount: number;
      currency: string;
      qrString: string;
      khqrMd5: string;
    },
  ) {
    return await prisma.payment.update({
      where: {
        orderId,
      },
      data,
    });
  }

  async markPaid(orderId: string, bakongTxId?: string) {
    return await prisma.payment.update({
      where: {
        orderId,
      },
      data: {
        status: 'PAID',
        ...(bakongTxId ? { bakongTxId } : {}),
      },
    });
  }

  async markPaidConditional(orderId: string, expectedStatus: string, bakongTxId?: string) {
    const result: { count: number } = await prisma.payment.updateMany({
      where: {
        orderId,
        status: expectedStatus,
      },
      data: {
        status: 'PAID',
        ...(bakongTxId ? { bakongTxId } : {}),
      },
    });

    const payment = await prisma.payment.findUnique({
      where: { orderId },
    });

    if (!payment) {
      throw new Error('Payment not found');
    }

    return payment;
  }

  async saveBakongTx(orderId: string, bakongTxId: string) {
    return await prisma.payment.update({
      where: {
        orderId,
      },
      data: {
        bakongTxId,
      },
    });
  }
}
