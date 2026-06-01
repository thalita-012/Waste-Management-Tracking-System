import { prisma } from '../utils/prisma.js';
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
    async markPaid(orderId, bakongTxId) {
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
    async markPaidConditional(orderId, expectedStatus, bakongTxId) {
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
                return payment;
            }
            // Return the updated payment
            return await prisma.payment.findUnique({
                where: { orderId },
            }).then(p => p);
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