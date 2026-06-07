"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRepository = exports.UserRepository = void 0;
const prisma_js_1 = require("../utils/prisma.js");
class UserRepository {
    mapPrismaUser(prismaUser) {
        if (!prismaUser)
            return null;
        return {
            id: prismaUser.id,
            full_name: prismaUser.name || '',
            email: prismaUser.email || '',
            password_hash: prismaUser.password || '',
            phone_number: prismaUser.phoneNumber || prismaUser.phone_number || undefined,
            address: prismaUser.address || undefined,
            profile_picture: prismaUser.profilePicture ?? prismaUser.profile_picture ?? null,
            latitude: prismaUser.latitude ?? undefined,
            longitude: prismaUser.longitude ?? undefined,
            password_reset_token: prismaUser.passwordResetToken ?? prismaUser.password_reset_token ?? null,
            password_reset_expires_at: prismaUser.passwordResetExpiresAt ?? prismaUser.password_reset_expires_at ?? null,
            created_at: prismaUser.createdAt || prismaUser.created_at,
            updated_at: prismaUser.updatedAt || prismaUser.updated_at,
        };
    }
    async findByEmail(email) {
        try {
            const u = await prisma_js_1.prisma.user.findUnique({ where: { email } });
            return this.mapPrismaUser(u);
        }
        catch (error) {
            console.error('Error finding user by email (prisma):', error);
            throw error;
        }
    }
    async findById(id) {
        try {
            const u = await prisma_js_1.prisma.user.findUnique({ where: { id } });
            return this.mapPrismaUser(u);
        }
        catch (error) {
            console.error('Error finding user by id (prisma):', error);
            throw error;
        }
    }
    async create(input) {
        try {
            const data = {
                name: input.full_name,
                email: input.email,
                password: input.password_hash,
            };
            // Attach optional fields if provided
            if (input.phone_number !== undefined)
                data.phoneNumber = input.phone_number;
            if (input.address !== undefined)
                data.address = input.address;
            if (input.profile_picture !== undefined)
                data.profilePicture = input.profile_picture;
            if (input.latitude !== undefined)
                data.latitude = input.latitude;
            if (input.longitude !== undefined)
                data.longitude = input.longitude;
            const created = await prisma_js_1.prisma.user.create({ data });
            return this.mapPrismaUser(created);
        }
        catch (error) {
            console.error('Error creating user (prisma):', error);
            throw error;
        }
    }
    async update(id, input) {
        try {
            const data = {};
            if (input.full_name !== undefined)
                data.name = input.full_name;
            if (input.phone_number !== undefined)
                data.phoneNumber = input.phone_number;
            if (input.address !== undefined)
                data.address = input.address;
            if (input.profile_picture !== undefined)
                data.profilePicture = input.profile_picture;
            if (input.latitude !== undefined)
                data.latitude = input.latitude;
            if (input.longitude !== undefined)
                data.longitude = input.longitude;
            const updated = await prisma_js_1.prisma.user.update({ where: { id }, data });
            return this.mapPrismaUser(updated);
        }
        catch (error) {
            console.error('Error updating user (prisma):', error);
            throw error;
        }
    }
    async updatePasswordResetToken(userId, token, expiresAt) {
        try {
            const updated = await prisma_js_1.prisma.user.update({ where: { id: userId }, data: { passwordResetToken: token, passwordResetExpiresAt: expiresAt } });
            return this.mapPrismaUser(updated);
        }
        catch (error) {
            console.error('Error updating reset token (prisma):', error);
            throw error;
        }
    }
    async findByResetToken(token) {
        try {
            const u = await prisma_js_1.prisma.user.findFirst({ where: { passwordResetToken: token, passwordResetExpiresAt: { gt: new Date() } } });
            return this.mapPrismaUser(u);
        }
        catch (error) {
            console.error('Error finding user by reset token (prisma):', error);
            throw error;
        }
    }
    async resetPassword(userId, password_hash) {
        try {
            const updated = await prisma_js_1.prisma.user.update({ where: { id: userId }, data: { password: password_hash, passwordResetToken: null, passwordResetExpiresAt: null } });
            return this.mapPrismaUser(updated);
        }
        catch (error) {
            console.error('Error resetting password (prisma):', error);
            throw error;
        }
    }
    async delete(id) {
        try {
            await prisma_js_1.prisma.user.delete({ where: { id } });
            return true;
        }
        catch (error) {
            console.error('Error deleting user (prisma):', error);
            throw error;
        }
    }
}
exports.UserRepository = UserRepository;
exports.userRepository = new UserRepository();
//# sourceMappingURL=UserRepository.js.map