import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import botRoutes from './routes/bot.routes';
import contactRoutes from './routes/contact.routes';
import categoryRoutes from './routes/category.routes';
import conversationRoutes from './routes/conversation.routes';
import authRoutes from './routes/auth.routes';
import whatsappRoutes from './routes/whatsapp.routes';

const app = express();

app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/bots', botRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/whatsapp', whatsappRoutes);

// Add error handling middleware as last middleware
import { errorMiddleware } from './middleware/error.middleware';
app.use(errorMiddleware);

export default app;
