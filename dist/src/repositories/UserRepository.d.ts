import type { User, CreateUserInput, UpdateUserInput } from '../models/User.js';
export declare class UserRepository {
    findByEmail(email: string): Promise<User | null>;
    findById(id: number): Promise<User | null>;
    create(input: CreateUserInput & {
        password_hash: string;
    }): Promise<User>;
    update(id: number, input: UpdateUserInput): Promise<User | null>;
    updatePasswordResetToken(userId: number, token: string, expiresAt: Date): Promise<User | null>;
    findByResetToken(token: string): Promise<User | null>;
    resetPassword(userId: number, password_hash: string): Promise<User | null>;
    delete(id: number): Promise<boolean>;
}
export declare const userRepository: UserRepository;
//# sourceMappingURL=UserRepository.d.ts.map