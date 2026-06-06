import type { User, CreateUserInput, UpdateUserInput } from '../models/User.js';
import { prisma } from '../utils/prisma.js';

export class UserRepository {
  private mapPrismaUser(prismaUser: any): User {
    if (!prismaUser) return null as any;

    return {
      id: prismaUser.id,
      full_name: prismaUser.name || '',
      email: prismaUser.email || '',
      password_hash: prismaUser.password || '',
      phone_number: (prismaUser as any).phoneNumber || (prismaUser as any).phone_number || undefined,
      address: (prismaUser as any).address || undefined,
      profile_picture: (prismaUser as any).profilePicture ?? (prismaUser as any).profile_picture ?? null,
      latitude: (prismaUser as any).latitude ?? undefined,
      longitude: (prismaUser as any).longitude ?? undefined,
      password_reset_token: (prismaUser as any).passwordResetToken ?? (prismaUser as any).password_reset_token ?? null,
      password_reset_expires_at: (prismaUser as any).passwordResetExpiresAt ?? (prismaUser as any).password_reset_expires_at ?? null,
      created_at: prismaUser.createdAt || prismaUser.created_at,
      updated_at: prismaUser.updatedAt || prismaUser.updated_at,
    } as User;
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const u = await prisma.user.findUnique({ where: { email } });
      return this.mapPrismaUser(u);
    } catch (error) {
      console.error('Error finding user by email (prisma):', error);
      throw error;
    }
  }

  async findById(id: number): Promise<User | null> {
    try {
      const u = await prisma.user.findUnique({ where: { id } });
      return this.mapPrismaUser(u);
    } catch (error) {
      console.error('Error finding user by id (prisma):', error);
      throw error;
    }
  }

  async create(input: CreateUserInput & { password_hash: string }): Promise<User> {
    try {
      const data: any = {
        name: input.full_name,
        email: input.email,
        password: input.password_hash,
      };

      // Attach optional fields if provided
      if ((input as any).phone_number !== undefined) data.phoneNumber = (input as any).phone_number;
      if ((input as any).address !== undefined) data.address = (input as any).address;
      if ((input as any).profile_picture !== undefined) data.profilePicture = (input as any).profile_picture;
      if ((input as any).latitude !== undefined) data.latitude = (input as any).latitude;
      if ((input as any).longitude !== undefined) data.longitude = (input as any).longitude;

      const created = await prisma.user.create({ data });
      return this.mapPrismaUser(created);
    } catch (error) {
      console.error('Error creating user (prisma):', error);
      throw error;
    }
  }

  async update(id: number, input: UpdateUserInput): Promise<User | null> {
    try {
      const data: any = {};
      if (input.full_name !== undefined) data.name = input.full_name;
      if ((input as any).phone_number !== undefined) data.phoneNumber = (input as any).phone_number;
      if (input.address !== undefined) data.address = input.address;
      if (input.profile_picture !== undefined) data.profilePicture = input.profile_picture;
      if (input.latitude !== undefined) data.latitude = input.latitude;
      if (input.longitude !== undefined) data.longitude = input.longitude;

      const updated = await prisma.user.update({ where: { id }, data });
      return this.mapPrismaUser(updated);
    } catch (error) {
      console.error('Error updating user (prisma):', error);
      throw error;
    }
  }

  async updatePasswordResetToken(userId: number, token: string, expiresAt: Date): Promise<User | null> {
    try {
      const updated = await prisma.user.update({ where: { id: userId }, data: { passwordResetToken: token, passwordResetExpiresAt: expiresAt } as any });
      return this.mapPrismaUser(updated);
    } catch (error) {
      console.error('Error updating reset token (prisma):', error);
      throw error;
    }
  }

  async findByResetToken(token: string): Promise<User | null> {
    try {
      const u = await prisma.user.findFirst({ where: { passwordResetToken: token, passwordResetExpiresAt: { gt: new Date() } } as any });
      return this.mapPrismaUser(u);
    } catch (error) {
      console.error('Error finding user by reset token (prisma):', error);
      throw error;
    }
  }

  async resetPassword(userId: number, password_hash: string): Promise<User | null> {
    try {
      const updated = await prisma.user.update({ where: { id: userId }, data: { password: password_hash, passwordResetToken: null, passwordResetExpiresAt: null } as any });
      return this.mapPrismaUser(updated);
    } catch (error) {
      console.error('Error resetting password (prisma):', error);
      throw error;
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      await prisma.user.delete({ where: { id } });
      return true;
    } catch (error) {
      console.error('Error deleting user (prisma):', error);
      throw error;
    }
  }
}

export const userRepository = new UserRepository();
