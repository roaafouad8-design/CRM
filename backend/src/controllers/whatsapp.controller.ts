import { Request, Response } from 'express';
import { ApiResponse } from '../utils/apiResponse';

type SessionStatus = 'pending' | 'connected';

interface SessionInfo {
  status: SessionStatus;
  createdAt: Date;
  lastChecked: Date;
}

// In-memory placeholder store; replace with real WhatsApp session management.
const sessionStore = new Map<string, SessionInfo>();

export class WhatsAppController {
  createSession(req: Request, res: Response) {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json(ApiResponse.error('Unauthorized'));

    const existing = sessionStore.get(userId);
    if (existing) {
      existing.lastChecked = new Date();
      return res.json(ApiResponse.success('WhatsApp session already active', { status: existing.status }));
    }

    const session: SessionInfo = {
      status: 'connected',
      createdAt: new Date(),
      lastChecked: new Date(),
    };

    sessionStore.set(userId, session);
    return res.status(201).json(ApiResponse.success('WhatsApp session created', { status: session.status }));
  }

  getStatus(req: Request, res: Response) {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json(ApiResponse.error('Unauthorized'));

    const session = sessionStore.get(userId);
    if (!session) {
      return res.status(404).json(ApiResponse.error('No active WhatsApp session'));
    }

    session.lastChecked = new Date();
    return res.json(
      ApiResponse.success('WhatsApp session status retrieved', {
        status: session.status,
        lastChecked: session.lastChecked,
      }),
    );
  }
}
