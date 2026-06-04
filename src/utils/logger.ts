// Simple structured logger for production use
import { env } from '../config/env.js';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogData {
  [key: string]: any;
}

class Logger {
  private formatLog(level: LogLevel, message: string, data?: LogData) {
    const timestamp = new Date().toISOString();
    return {
      timestamp,
      level,
      message,
      ...(data && { data }),
    };
  }

  info(message: string, data?: LogData) {
    const log = this.formatLog('info', message, data);
    console.log(JSON.stringify(log));
  }

  warn(message: string, data?: LogData) {
    const log = this.formatLog('warn', message, data);
    console.warn(JSON.stringify(log));
  }

  error(message: string, data?: LogData) {
    const log = this.formatLog('error', message, data);
    console.error(JSON.stringify(log));
  }

  debug(message: string, data?: LogData) {
    if (env.nodeEnv !== 'production') {
      const log = this.formatLog('debug', message, data);
      console.debug(JSON.stringify(log));
    }
  }
}

export const logger = new Logger();
