export interface User {
  id: number;
  full_name: string;
  email: string;
  password_hash: string;
  phone_number?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  password_reset_token?: string | null;
  password_reset_expires_at?: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface CreateUserInput {
  full_name: string;
  email: string;
  password: string;
  phone_number?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
}

export interface UpdateUserInput {
  full_name?: string;
  phone_number?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: Omit<User, 'password_hash'>;
  error?: string;
}
