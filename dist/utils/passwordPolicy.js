"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePasswordStrength = validatePasswordStrength;
const MIN_PASSWORD_LENGTH = 8;
const joinRequirements = (requirements) => {
    if (requirements.length === 0) {
        return '';
    }
    if (requirements.length === 1) {
        return requirements[0];
    }
    if (requirements.length === 2) {
        return `${requirements[0]} and ${requirements[1]}`;
    }
    return `${requirements.slice(0, -1).join(', ')}, and ${requirements[requirements.length - 1]}`;
};
function validatePasswordStrength(password) {
    const issues = [];
    if (password.length < MIN_PASSWORD_LENGTH) {
        issues.push(`at least ${MIN_PASSWORD_LENGTH} characters`);
    }
    if (!/[a-z]/.test(password)) {
        issues.push('one lowercase letter');
    }
    if (!/[A-Z]/.test(password)) {
        issues.push('one uppercase letter');
    }
    if (!/[0-9]/.test(password)) {
        issues.push('one number');
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
        issues.push('one special character');
    }
    if (issues.length === 0) {
        return {
            isStrong: true,
            message: 'Password is strong.',
            issues
        };
    }
    return {
        isStrong: false,
        message: 'Password is not strong enough. Please choose a stronger password.',
        issues
    };
}
//# sourceMappingURL=passwordPolicy.js.map