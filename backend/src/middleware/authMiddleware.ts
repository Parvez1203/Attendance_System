// src/middleware/authMiddleware.ts
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

dotenv.config();

declare global {
  namespace Express {
    interface Request {
      user?: { user_id: number; role: string };
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || '';

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Authorization token is required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { user_id: number; role: string };
    req.user = decoded; // Attach decoded user data to request
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};
