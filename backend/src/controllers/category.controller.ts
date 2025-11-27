import { Request, Response } from 'express';
import { CategoryService } from '../services/category.service';
import { ApiResponse } from '../utils/apiResponse';

const categoryService = new CategoryService();

export class CategoryController {
  async createCategory(req: Request, res: Response) {
    try {
      const { name } = req.body;
      const userId = req.user?.id as string;

      const category = await categoryService.createCategory(userId, name);
      return res.status(201).json(ApiResponse.success('Category created successfully', category));
    } catch (error) {
      return res.status(500).json(ApiResponse.error('Failed to create category', (error as Error).message));
    }
  }

  async getCategories(req: Request, res: Response) {
    try {
      const userId = req.user?.id as string;
      const categories = await categoryService.getCategories(userId);
      return res.json(ApiResponse.success('Categories retrieved successfully', categories));
    } catch (error) {
      return res.status(500).json(ApiResponse.error('Failed to retrieve categories'));
    }
  }

  async updateCategory(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name } = req.body;
      const userId = req.user?.id as string;

      const category = await categoryService.updateCategory(id, userId, name);
      return res.json(ApiResponse.success('Category updated successfully', category));
    } catch (error) {
      return res.status(500).json(ApiResponse.error('Failed to update category', (error as Error).message));
    }
  }

  async deleteCategory(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id as string;

      await categoryService.deleteCategory(id, userId);
      return res.json(ApiResponse.success('Category deleted successfully'));
    } catch (error) {
      return res.status(500).json(ApiResponse.error('Failed to delete category', (error as Error).message));
    }
  }
}
