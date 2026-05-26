import { prisma } from "../utils/prisma.js";
export class PaymentRepository {
    async create(data) {
        return await prisma.payment.create({
            data,
        });
    }
    async findByOrderId(orderId) {
        return await prisma.payment.findUnique({
            where: {
                orderId,
            },
        });
    }
    async updateStatus(orderId, status) {
        return await prisma.payment.update({
            where: {
                orderId,
            },
            data: {
                status,
            },
        });
    }
    async saveBakongTx(orderId, bakongTxId) {
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
//# sourceMappingURL=PaymentRepository.js.map