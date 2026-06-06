import 'dotenv/config';
export declare const env: {
    nodeEnv: string;
    port: number;
    jwtSecret: string;
    database: {
        host: string;
        port: number;
        user: string;
        password: string | undefined;
        name: string;
        url: string;
    };
    bakong: {
        apiBaseUrl: string | undefined;
        apiToken: string | undefined;
        accountId: string | undefined;
        accountInformation: string | undefined;
        merchantName: string | undefined;
        merchantCity: string;
        merchantId: string | undefined;
        acquiringBank: string | undefined;
        qrExpirationMinutes: number;
    };
};
export declare const getRequiredConfig: (name: string, value?: string) => string;
//# sourceMappingURL=env.d.ts.map