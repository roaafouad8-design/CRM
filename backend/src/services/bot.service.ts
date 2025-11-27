import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class BotService {
  async createBot(userId: string, data: { name: string; type: string; config: any }) {
    return await prisma.bot.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async getBotsByUser(userId: string) {
    return await prisma.bot.findMany({
      where: { userId },
    });
  }

  async updateBot(id: string, userId: string, data: { name?: string; type?: string; config?: any }) {
    const bot = await prisma.bot.findFirst({ where: { id, userId } });
    if (!bot) {
      throw new Error('Bot not found');
    }

    return await prisma.bot.update({
      where: { id },
      data,
    });
  }

  async deleteBot(id: string, userId: string) {
    const bot = await prisma.bot.findFirst({ where: { id, userId } });
    if (!bot) {
      throw new Error('Bot not found');
    }

    return await prisma.bot.delete({
      where: { id },
    });
  }
}
