import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export class ConversationService {
  async createConversation(
    userId: string,
    contactId: string,
    messages: Prisma.InputJsonValue[] = []
  ) {
    const cleanMessages = messages.filter((msg) => msg !== null) as Prisma.InputJsonValue[];

    return prisma.conversation.create({
      data: {
        contactId,
        messages: cleanMessages,
        userId,
      },
    });
  }

  async getConversations(userId: string) {
    return prisma.conversation.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      include: {
        contact: true,
      },
    });
  }

  async getConversationById(id: string, userId: string) {
    return prisma.conversation.findFirst({
      where: { id, userId },
      include: {
        contact: true,
      },
    });
  }

  async updateConversation(id: string, userId: string, messages: Prisma.JsonArray) {
    const conversation = await prisma.conversation.findFirst({ where: { id, userId } });
    if (!conversation) {
      throw new Error('Conversation not found');
    }

    const cleanMessages = (messages ?? []).filter((msg) => msg !== null) as Prisma.InputJsonValue[];

    return prisma.conversation.update({
      where: { id },
      data: { messages: cleanMessages },
    });
  }

  async appendMessage(id: string, userId: string, message: Prisma.InputJsonValue) {
    const conversation = await prisma.conversation.findFirst({ where: { id, userId } });
    if (!conversation) {
      throw new Error('Conversation not found');
    }

    const existingMessages = Array.isArray(conversation.messages)
      ? (conversation.messages as unknown as Prisma.InputJsonValue[]).filter((msg) => msg !== null)
      : [];

    const messages = [...existingMessages, message];

    return prisma.conversation.update({
      where: { id },
      data: { messages },
    });
  }

  async deleteConversation(id: string, userId: string) {
    const conversation = await prisma.conversation.findFirst({ where: { id, userId } });
    if (!conversation) {
      throw new Error('Conversation not found');
    }

    return prisma.conversation.delete({
      where: { id },
    });
  }
}
