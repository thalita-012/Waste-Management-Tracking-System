export interface PasswordPolicyResult {
    isStrong: boolean;
    message: string;
    issues: string[];
}
export declare function validatePasswordStrength(password: string): PasswordPolicyResult;
