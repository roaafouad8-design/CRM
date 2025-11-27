import { Router } from 'express';
import { ContactController } from '../controllers/contact.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const contactController = new ContactController();

router.use(authMiddleware);

router.post('/', contactController.createContact);
router.get('/', contactController.getContacts);
router.put('/:id', contactController.updateContact);
router.delete('/:id', contactController.deleteContact);

export default router;
