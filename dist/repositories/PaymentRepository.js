"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRepository = void 0;
const prisma_js_1 = require("../utils/prisma.js");
class PaymentRepository {
    async create(data) {
        return await prisma_js_1.prisma.payment.create({
            data,
        });
    }
    async findByOrderId(orderId) {
        return await prisma_js_1.prisma.payment.findUnique({
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
    async refreshQr(orderId, data) {
        return await prisma_js_1.prisma.payment.update({
            where: {
                orderId,
            },
            data,
        });
    }
    async markPaid(orderId, bakongTxId) {
        return await prisma_js_1.prisma.payment.update({
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
        const result = await prisma_js_1.prisma.payment.updateMany({
            where: {
                orderId,
                status: expectedStatus,
            },
            data: {
                status: 'PAID',
                ...(bakongTxId ? { bakongTxId } : {}),
            },
        });
        const payment = await prisma_js_1.prisma.payment.findUnique({
            where: { orderId },
        });
        if (!payment) {
            throw new Error('Payment not found');
        }
        return payment;
    }
    async saveBakongTx(orderId, bakongTxId) {
        return await prisma_js_1.prisma.payment.update({
            where: {
                orderId,
            },
            data: {
                bakongTxId,
            },
        });
    }
}
exports.PaymentRepository = PaymentRepository;
//# sourceMappingURL=PaymentRepository.js.map