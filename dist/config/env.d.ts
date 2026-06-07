import 'dotenv/config';
export declare const env: {
    nodeEnv: string;
    port: number;
    jwtSecret: string;
    database: {
        host: string;
        port: number;
        user: string;
        password: string;
        name: string;
        url: string;
    };
    bakong: {
        apiBaseUrl: string;
        apiToken: string;
        accountId: string;
        accountInformation: string;
        merchantName: string;
        merchantCity: string;
        merchantId: string;
        acquiringBank: string;
        qrExpirationMinutes: number;
    };
};
export declare const getRequiredConfig: (name: string, value?: string) => string;
