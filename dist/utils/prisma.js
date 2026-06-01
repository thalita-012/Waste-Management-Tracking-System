<<<<<<< HEAD
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    throw new Error('DATABASE_URL is required for Prisma');
}
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
export const prisma = new PrismaClient({ adapter });
=======
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
>>>>>>> b7808adb37a07e5f45a60d6aaf8cba3683e41758
//# sourceMappingURL=prisma.js.map