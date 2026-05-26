const paymentsByOrderId = new Map();
const createId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
export const prisma = {
    payment: {
        async create({ data }) {
            const now = new Date();
            const record = {
                id: createId(),
                createdAt: now,
                updatedAt: now,
                ...data,
            };
            paymentsByOrderId.set(record.orderId, record);
            return record;
        },
        async findUnique({ where }) {
            return paymentsByOrderId.get(where.orderId) ?? null;
        },
        async update({ where, data }) {
            const existing = paymentsByOrderId.get(where.orderId);
            if (!existing)
                throw new Error("Payment not found");
            const updated = { ...existing, ...data, updatedAt: new Date() };
            paymentsByOrderId.set(where.orderId, updated);
            return updated;
        },
    },
};
//# sourceMappingURL=prisma.js.map