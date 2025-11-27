import { Router } from 'express';
import { WhatsAppController } from '../controllers/whatsapp.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const controller = new WhatsAppController();

router.use(authMiddleware);

router.post('/session', controller.createSession.bind(controller));
router.get('/status', controller.getStatus.bind(controller));

export default router;
