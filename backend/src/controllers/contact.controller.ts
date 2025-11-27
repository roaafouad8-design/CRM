import { Request, Response } from 'express';
import { ContactService } from '../services/contact.service';
import { ApiResponse } from '../utils/apiResponse';

const contactService = new ContactService();

export class ContactController {
  async createContact(req: Request, res: Response) {
    try {
      const { name, phone, email } = req.body;
      const userId = req.user?.id as string;

      const contact = await contactService.createContact(userId, { name, phone, email });
      return res.status(201).json(ApiResponse.success('Contact created successfully', contact));
    } catch (error) {
      return res.status(500).json(ApiResponse.error('Failed to create contact', (error as Error).message));
    }
  }

  async getContacts(req: Request, res: Response) {
    try {
      const userId = req.user?.id as string;
      const contacts = await contactService.getContacts(userId);
      return res.json(ApiResponse.success('Contacts retrieved successfully', contacts));
    } catch (error) {
      return res.status(500).json(ApiResponse.error('Failed to retrieve contacts'));
    }
  }

  async updateContact(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, phone, email } = req.body;
      const userId = req.user?.id as string;

      const contact = await contactService.updateContact(id, userId, { name, phone, email });
      return res.json(ApiResponse.success('Contact updated successfully', contact));
    } catch (error) {
      return res.status(500).json(ApiResponse.error('Failed to update contact', (error as Error).message));
    }
  }

  async deleteContact(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id as string;

      await contactService.deleteContact(id, userId);
      return res.json(ApiResponse.success('Contact deleted successfully'));
    } catch (error) {
      return res.status(500).json(ApiResponse.error('Failed to delete contact', (error as Error).message));
    }
  }
}
