import { Router } from 'express';
import { ConversationController } from '../controllers/conversation.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const conversationController = new ConversationController();

router.use(authMiddleware);

router.post('/', conversationController.createConversation);
router.get('/', conversationController.getConversations);
router.put('/:id', conversationController.updateConversation);
router.post('/:id/messages', conversationController.appendMessage);
router.post('/:id/ai-reply', conversationController.generateAIReply);
router.delete('/:id', conversationController.deleteConversation);

export default router;
