import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class CategoryService {
  async createCategory(userId: string, name: string) {
    return prisma.category.create({
      data: { name, userId },
    });
  }

  async getCategories(userId: string) {
    return prisma.category.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateCategory(id: string, userId: string, name: string) {
    const category = await prisma.category.findFirst({ where: { id, userId } });
    if (!category) {
      throw new Error('Category not found');
    }

    return prisma.category.update({
      where: { id },
      data: { name },
    });
  }

  async deleteCategory(id: string, userId: string) {
    const category = await prisma.category.findFirst({ where: { id, userId } });
    if (!category) {
      throw new Error('Category not found');
    }

    return prisma.category.delete({
      where: { id },
    });
  }
}
