import jwt, { type SignOptions } from 'jsonwebtoken';
import { env } from '../config/env.js';

const JWT_SECRET = env.jwtSecret;

export const generateToken = (payload: object, expiresIn: SignOptions['expiresIn'] = '1d') => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};
