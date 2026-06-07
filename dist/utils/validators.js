"use strict";
// Validation helpers for payment processing
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentValidator = void 0;
class PaymentValidator {
    /**
     * Validate payment creation request
     */
    static validateCreatePayment(orderId, amount, currency) {
        const errors = [];
        // Validate orderId
        if (!orderId || typeof orderId !== 'string' || orderId.trim().length === 0) {
            errors.push('orderId is required and must be a non-empty string');
        }
        // Validate amount
        const numAmount = Number(amount);
        if (isNaN(numAmount)) {
            errors.push('amount must be a valid number');
        }
        else if (numAmount <= 0) {
            errors.push('amount must be greater than 0');
        }
        else if (numAmount > 1000000000) {
            errors.push('amount exceeds maximum limit');
        }
        // Validate currency
        const validCurrencies = ['KHR', 'USD'];
        if (!currency || !validCurrencies.includes(currency.toUpperCase())) {
            errors.push(`currency must be one of: ${validCurrencies.join(', ')}`);
        }
        return {
            isValid: errors.length === 0,
            errors,
        };
    }
    /**
     * Validate payment verification request
     */
    static validateVerifyPayment(orderId) {
        const errors = [];
        if (!orderId || typeof orderId !== 'string' || orderId.trim().length === 0) {
            errors.push('orderId is required and must be a non-empty string');
        }
        return {
            isValid: errors.length === 0,
            errors,
        };
    }
}
exports.PaymentValidator = PaymentValidator;
//# sourceMappingURL=validators.js.map