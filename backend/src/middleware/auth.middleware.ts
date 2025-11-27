import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key';

type AuthenticatedRequest = Request & { user?: { id: string } };

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: missing or invalid token',
    });
  }

  const token = authHeader.slice('Bearer '.length).trim();

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId?: string };
    if (!payload?.userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: invalid token payload',
      });
    }

    req.user = { id: payload.userId };
    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: invalid or expired token',
    });
  }
};
