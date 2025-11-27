import { Request, Response } from 'express';
import { ConversationService } from '../services/conversation.service';
import { ApiResponse } from '../utils/apiResponse';
import { AIService } from '../services/ai.service';

const conversationService = new ConversationService();
const aiService = new AIService();

export class ConversationController {
  async createConversation(req: Request, res: Response) {
    try {
      const { contactId, messages } = req.body;
      const userId = req.user?.id as string;

      const conversation = await conversationService.createConversation(userId, contactId, messages);
      return res.status(201).json(ApiResponse.success('Conversation created successfully', conversation));
    } catch (error) {
      return res.status(500).json(ApiResponse.error('Failed to create conversation', (error as Error).message));
    }
  }

  async getConversations(req: Request, res: Response) {
    try {
      const userId = req.user?.id as string;
      const conversations = await conversationService.getConversations(userId);
      return res.json(ApiResponse.success('Conversations retrieved successfully', conversations));
    } catch (error) {
      return res.status(500).json(ApiResponse.error('Failed to retrieve conversations'));
    }
  }

  async updateConversation(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { messages } = req.body;
      const userId = req.user?.id as string;

      const conversation = await conversationService.updateConversation(id, userId, messages);
      return res.json(ApiResponse.success('Conversation updated successfully', conversation));
    } catch (error) {
      return res.status(500).json(ApiResponse.error('Failed to update conversation', (error as Error).message));
    }
  }

  async appendMessage(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { message } = req.body;
      const userId = req.user?.id as string;

      const conversation = await conversationService.appendMessage(id, userId, message);
      return res.json(ApiResponse.success('Message added successfully', conversation));
    } catch (error) {
      return res.status(500).json(ApiResponse.error('Failed to add message', (error as Error).message));
    }
  }

  async deleteConversation(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id as string;

      await conversationService.deleteConversation(id, userId);
      return res.json(ApiResponse.success('Conversation deleted successfully'));
    } catch (error) {
      return res.status(500).json(ApiResponse.error('Failed to delete conversation', (error as Error).message));
    }
  }

  async generateAIReply(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { prompt } = req.body;
      const userId = req.user?.id as string;

      const conversation = await conversationService.getConversationById(id, userId);
      if (!conversation) {
        return res.status(404).json(ApiResponse.error('Conversation not found'));
      }

      const history = Array.isArray(conversation.messages) ? (conversation.messages as any[]) : [];
      const reply = await aiService.generateReply(prompt ?? '', history);

      const updatedConversation = await conversationService.appendMessage(id, userId, {
        role: 'assistant',
        content: reply,
      });

      return res.json(
        ApiResponse.success('AI reply generated', {
          reply,
          conversation: updatedConversation,
        })
      );
    } catch (error) {
      return res.status(500).json(ApiResponse.error('Failed to generate AI reply', (error as Error).message));
    }
  }
}
