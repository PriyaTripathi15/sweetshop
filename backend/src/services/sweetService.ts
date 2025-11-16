import { Sweet, ISweet } from '../models/Sweet';

export class SweetService {
  async createSweet(sweetData: Partial<ISweet>): Promise<ISweet> {
    const sweet = await Sweet.create(sweetData);
    return sweet;
  }

  async getAllSweets(): Promise<ISweet[]> {
    const sweets = await Sweet.find();
    return sweets;
  }

  async getSweetById(id: string): Promise<ISweet | null> {
    const sweet = await Sweet.findById(id);
    return sweet;
  }

  async searchSweets(query: {
    name?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<ISweet[]> {
    const filter: any = {};

    if (query.name) {
      filter.name = { $regex: query.name, $options: 'i' };
    }

    if (query.category) {
      filter.category = { $regex: query.category, $options: 'i' };
    }

    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      filter.price = {};
      if (query.minPrice !== undefined) {
        filter.price.$gte = query.minPrice;
      }
      if (query.maxPrice !== undefined) {
        filter.price.$lte = query.maxPrice;
      }
    }

    const sweets = await Sweet.find(filter);
    return sweets;
  }

  async updateSweet(id: string, updateData: Partial<ISweet>): Promise<ISweet | null> {
    const sweet = await Sweet.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    return sweet;
  }

  async deleteSweet(id: string): Promise<ISweet | null> {
    const sweet = await Sweet.findByIdAndDelete(id);
    return sweet;
  }

  async purchaseSweet(id: string, quantity: number = 1): Promise<ISweet> {
    const sweet = await Sweet.findById(id);
    
    if (!sweet) {
      throw new Error('Sweet not found');
    }

    if (sweet.quantity < quantity) {
      throw new Error('Insufficient stock');
    }

    sweet.quantity -= quantity;
    await sweet.save();

    return sweet;
  }

  async restockSweet(id: string, quantity: number): Promise<ISweet> {
    const sweet = await Sweet.findById(id);
    
    if (!sweet) {
      throw new Error('Sweet not found');
    }

    sweet.quantity += quantity;
    await sweet.save();

    return sweet;
  }
}
