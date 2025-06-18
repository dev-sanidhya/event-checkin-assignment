import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface Context {
  prisma: PrismaClient;
  user?: any;
}

export const createContext = async ({ req }: { req: any }): Promise<Context> => {
  let user = null;
  
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      user = await prisma.user.findUnique({
        where: { id: decoded.userId }
      });
    } catch (error) {
      console.log('Invalid token');
    }
  }

  return {
    prisma,
    user
  };
};

