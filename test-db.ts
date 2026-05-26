import { prisma } from './src/utils/prisma.js';

async function testPrisma() {
  console.log('Testing Prisma connection...');
  try {
    // Try to count payments (should be 0 or more, but shouldn't throw)
    const count = await prisma.payment.count();
    console.log(`Successfully connected to DB via Prisma. Current payment count: ${count}`);
    
    // Test model structure by attempting a dry-run find (if table exists)
    await prisma.user.findFirst();
    console.log('User model verified in schema.');
    
    process.exit(0);
  } catch (error: any) {
    console.error('Prisma test failed!');
    console.error('Error:', error.message);
    if (error.message.includes('does not exist')) {
      console.log('Hint: You might need to run "npx prisma db push" to create the tables.');
    }
    process.exit(1);
  }
}

testPrisma();
