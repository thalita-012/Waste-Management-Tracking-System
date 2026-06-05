import dotenv from 'dotenv';
import { execSync } from 'node:child_process';

dotenv.config();

try {
  console.log('Pushing Prisma schema to the database (using prisma/schema.prisma)...');
  execSync('npx prisma db push', { stdio: 'inherit' });

  console.log('Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });

  console.log('Prisma schema pushed and client generated successfully.');
} catch (error) {
  console.error('Failed to set up database using Prisma:');
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
