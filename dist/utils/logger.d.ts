interface LogData {
    [key: string]: any;
}
declare class Logger {
    private formatLog;
    info(message: string, data?: LogData): void;
    warn(message: string, data?: LogData): void;
    error(message: string, data?: LogData): void;
    debug(message: string, data?: LogData): void;
}
export declare const logger: Logger;
export {};
