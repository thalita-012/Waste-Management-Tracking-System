import type { CreateUserInput, UpdateUserInput, AuthResponse } from '../models/User.js';
export declare class AuthService {
    register(input: CreateUserInput): Promise<AuthResponse>;
    login(email: string, password: string): Promise<AuthResponse>;
    requestPasswordReset(email: string): Promise<AuthResponse>;
    resetPassword(token: string, password: string): Promise<AuthResponse>;
    updateProfile(userId: number, input: UpdateUserInput): Promise<AuthResponse>;
    getUserProfile(userId: number): Promise<AuthResponse>;
    verifyToken(token: string): {
        id: number;
        email: string;
    } | null;
}
export declare const authService: AuthService;
