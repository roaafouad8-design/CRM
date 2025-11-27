import { Request, Response, NextFunction } from 'express';

export function errorMiddleware(err: Error, req: Request, res: Response, next: NextFunction) {
  console.error('Unhandled error:', err.stack || err.message || err);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
}
