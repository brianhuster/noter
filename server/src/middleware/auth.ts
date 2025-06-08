import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

interface TokenPayload {
  id: string;
}

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      throw new Error();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as TokenPayload;
    const user = await User.findById(decoded.id);

    if (!user) {
      throw new Error();
    }

    req.userId = user.id;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Please authenticate' });
  }
};
