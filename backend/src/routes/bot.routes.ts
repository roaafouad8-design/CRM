import { Router } from 'express';
import { BotController } from '../controllers/bot.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const botController = new BotController();

router.use(authMiddleware);

router.post('/', botController.createBot);
router.get('/', botController.getBots);
router.put('/:id', botController.updateBot);
router.delete('/:id', botController.deleteBot);

export default router;
