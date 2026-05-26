import { prisma } from "../utils/prisma.js";

export class PaymentRepository {
  async create(data: any) {
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
