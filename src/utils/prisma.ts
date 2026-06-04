import { PrismaClient } from '../generated/prisma/client.js';

export const prisma = new PrismaClient({ adapter: undefined as any });