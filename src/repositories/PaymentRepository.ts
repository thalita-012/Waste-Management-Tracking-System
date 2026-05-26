import { prisma } from '../utils/prisma.js';

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

  async updateStatus(orderId: string, status: string) {
    return await prisma.payment.update({
      where: {
        orderId,
      },
      data: {
        status,
      },
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

  // ✅ NEW METHOD: Conditional update to prevent race conditions
  async markPaidConditional(orderId: string, expectedStatus: string, bakongTxId?: string) {
    // Only update if status is still in the expected state (PENDING)
    return await prisma.payment.updateMany({
      where: {
        orderId,
        status: expectedStatus,
      },
      data: {
        status: 'PAID',
        ...(bakongTxId ? { bakongTxId } : {}),
      },
    }).then(async (result) => {
      // If nothing was updated, it means another request already marked it as paid
      // Return the current payment record
      if (result.count === 0) {
        const payment = await prisma.payment.findUnique({
          where: { orderId },
        });
        return payment!;
      }
      // Return the updated payment
      return await prisma.payment.findUnique({
        where: { orderId },
      }).then(p => p!);
    });
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

