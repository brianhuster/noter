import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

interface TokenPayload {
  id: string;
}

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
      };
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

    // Add user ID to request
    req.user = { id: user._id.toString() };
    next();
  } catch (error) {
    res.status(401).json({ message: 'Please authenticate' });
  }
};
