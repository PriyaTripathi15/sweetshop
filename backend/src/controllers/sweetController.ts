import { Response } from 'express';
import { SweetService } from '../services/sweetService';
import { AuthRequest } from '../middleware/auth';
import { body, validationResult } from 'express-validator';

const sweetService = new SweetService();

export const sweetValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('quantity').isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer')
];

export const createSweet = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const sweet = await sweetService.createSweet(req.body);
    res.status(201).json(sweet);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllSweets = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const sweets = await sweetService.getAllSweets();
    res.status(200).json(sweets);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const searchSweets = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, category, minPrice, maxPrice } = req.query;
    
    const query: any = {};
    if (name) query.name = name as string;
    if (category) query.category = category as string;
    if (minPrice) query.minPrice = parseFloat(minPrice as string);
    if (maxPrice) query.maxPrice = parseFloat(maxPrice as string);

    const sweets = await sweetService.searchSweets(query);
    res.status(200).json(sweets);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSweet = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const sweet = await sweetService.updateSweet(id, req.body);
    
    if (!sweet) {
      res.status(404).json({ message: 'Sweet not found' });
      return;
    }

    res.status(200).json(sweet);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteSweet = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const sweet = await sweetService.deleteSweet(id);
    
    if (!sweet) {
      res.status(404).json({ message: 'Sweet not found' });
      return;
    }

    res.status(200).json({ message: 'Sweet deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const purchaseSweet = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    
    const sweet = await sweetService.purchaseSweet(id, quantity || 1);
    res.status(200).json(sweet);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const restockSweet = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    
    if (!quantity || quantity <= 0) {
      res.status(400).json({ message: 'Quantity must be a positive number' });
      return;
    }

    const sweet = await sweetService.restockSweet(id, quantity);
    res.status(200).json(sweet);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
