import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ContactService {
  async createContact(userId: string, data: { name: string; phone: string; email?: string }) {
    return prisma.contact.create({
      data: { ...data, userId },
    });
  }

  async getContacts(userId: string) {
    return prisma.contact.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateContact(
    id: string,
    userId: string,
    data: { name?: string; phone?: string; email?: string | null }
  ) {
    const contact = await prisma.contact.findFirst({ where: { id, userId } });
    if (!contact) {
      throw new Error('Contact not found');
    }

    return prisma.contact.update({
      where: { id },
      data,
    });
  }

  async deleteContact(id: string, userId: string) {
    const contact = await prisma.contact.findFirst({ where: { id, userId } });
    if (!contact) {
      throw new Error('Contact not found');
    }

    return prisma.contact.delete({
      where: { id },
    });
  }
}
