import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'celbrico_secret_key_123';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'celbrico_refresh_secret_key_456';

export const generateToken = (userId: string) => {
  return jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: '30d',
  });
};

export const generateRefreshToken = (userId: string) => {
  return jwt.sign({ id: userId }, REFRESH_SECRET, {
    expiresIn: '7d', // Long-lived refresh token
  });
};
