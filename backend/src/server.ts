import dotenv from 'dotenv';
import app from './app.js';

dotenv.config();

const port = Number(process.env.PORT) || 3000;

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

server.on('error', (error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
