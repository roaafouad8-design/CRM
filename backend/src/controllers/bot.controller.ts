import { Request, Response } from 'express';
import { BotService } from '../services/bot.service';
import { ApiResponse } from '../utils/apiResponse';

const botService = new BotService();

export class BotController {
  async createBot(req: Request, res: Response) {
    try {
      const { name, type, config } = req.body;
      const userId = req.user?.id;
      if (!userId) return res.status(401).json(ApiResponse.error('Unauthorized'));

      const bot = await botService.createBot(userId, { name, type, config });
      res.status(201).json(ApiResponse.success('Bot created successfully', bot));
    } catch (error) {
      res.status(500).json(ApiResponse.error('Failed to create bot'));
    }
  }

  async getBots(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json(ApiResponse.error('Unauthorized'));
      const bots = await botService.getBotsByUser(userId);
      res.json(ApiResponse.success('Bots retrieved successfully', bots));
    } catch (error) {
      res.status(500).json(ApiResponse.error('Failed to retrieve bots'));
    }
  }

  async updateBot(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, type, config } = req.body;
      const userId = req.user?.id;
      if (!userId) return res.status(401).json(ApiResponse.error('Unauthorized'));

      const bot = await botService.updateBot(id, userId, { name, type, config });
      res.json(ApiResponse.success('Bot updated successfully', bot));
    } catch (error) {
      res.status(500).json(ApiResponse.error('Failed to update bot'));
    }
  }

  async deleteBot(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      if (!userId) return res.status(401).json(ApiResponse.error('Unauthorized'));

      await botService.deleteBot(id, userId);
      res.json(ApiResponse.success('Bot deleted successfully'));
    } catch (error) {
      res.status(500).json(ApiResponse.error('Failed to delete bot'));
    }
  }
}
