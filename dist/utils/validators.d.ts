export declare class PaymentValidator {
    /**
     * Validate payment creation request
     */
    static validateCreatePayment(orderId: string, amount: any, currency: string): {
        isValid: boolean;
        errors: string[];
    };
    /**
     * Validate payment verification request
     */
    static validateVerifyPayment(orderId: string): {
        isValid: boolean;
        errors: string[];
    };
}
