// Simple structured logger for production use
class Logger {
    formatLog(level, message, data) {
        const timestamp = new Date().toISOString();
        return {
            timestamp,
            level,
            message,
            ...(data && { data }),
        };
    }
    info(message, data) {
        const log = this.formatLog('info', message, data);
        console.log(JSON.stringify(log));
    }
    warn(message, data) {
        const log = this.formatLog('warn', message, data);
        console.warn(JSON.stringify(log));
    }
    error(message, data) {
        const log = this.formatLog('error', message, data);
        console.error(JSON.stringify(log));
    }
    debug(message, data) {
        if (process.env.NODE_ENV !== 'production') {
            const log = this.formatLog('debug', message, data);
            console.debug(JSON.stringify(log));
        }
    }
}
export const logger = new Logger();
//# sourceMappingURL=logger.js.map