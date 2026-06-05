import dotenv from "dotenv";
import app from "./app.js";
import app from './app.js';

import { env } from './config/env.js';
import { testConnection } from './config/db.js';

/**
 * Start application server
 */
const startServer = async (): Promise<void> => {
  try {
    // Test database connection
    const isDatabaseConnected = await testConnection();

const port = Number(process.env.PORT) || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
    if (!isDatabaseConnected) {
      console.error('❌ Unable to connect to the database');

      process.exit(1);
    }

    // Start Express server
    app.listen(env.PORT, () => {
      console.log(
        `🚀 Server is running at http://localhost:${env.PORT}`
      );
    });
  } catch (error) {
    console.error('❌ Server startup failed:', error);

    process.exit(1);
  }
};

// Initialize application
startServer();
