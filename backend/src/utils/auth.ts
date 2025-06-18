import jwt from 'jsonwebtoken';

export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: '7d' });
};

export const requireAuth = (user: any) => {
  if (!user) {
    throw new Error('Authentication required');
  }
  return user;
};

