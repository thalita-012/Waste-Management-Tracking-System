type PaymentRecord = {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  qrString?: string;
  bakongTxId?: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

const paymentsByOrderId = new Map<string, PaymentRecord>();

const createId = (): string => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

export const prisma = {
  payment: {
    async create({ data }: { data: Omit<PaymentRecord, "id" | "createdAt" | "updatedAt"> }) {
      const now = new Date();
      const record: PaymentRecord = {
        id: createId(),
        createdAt: now,
        updatedAt: now,
        ...data,
      };

      paymentsByOrderId.set(record.orderId, record);
      return record;
    },

    async findUnique({ where }: { where: { orderId: string } }) {
      return paymentsByOrderId.get(where.orderId) ?? null;
    },

    async update({ where, data }: { where: { orderId: string }; data: Partial<PaymentRecord> }) {
      const existing = paymentsByOrderId.get(where.orderId);
      if (!existing) throw new Error("Payment not found");

      const updated: PaymentRecord = { ...existing, ...data, updatedAt: new Date() };
      paymentsByOrderId.set(where.orderId, updated);
      return updated;
    },
  },
} as const;
