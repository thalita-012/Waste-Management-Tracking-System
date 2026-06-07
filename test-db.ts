import { PrismaClient } from '@prisma/client';

// Load .env file
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

async function testPrisma() {
  console.log('Testing Prisma connection...');
  console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
  
  try {
    await prisma.$connect();
    console.log('✅ Successfully connected to DB via Prisma');
    
    const result: any = await prisma.$queryRaw`SELECT NOW() as current_time`;
    console.log('📅 Database server time:', result[0].current_time);
    
    const tables: any = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    
    const tableNames = tables.map((t: any) => t.table_name).join(', ');
    console.log('📊 Tables in database:', tableNames || 'none');
    
    await prisma.$disconnect();
    process.exit(0);
    
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    await prisma.$disconnect();
    process.exit(1);
  }
}

testPrisma();