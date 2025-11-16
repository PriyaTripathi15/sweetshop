import { SweetService } from '../services/sweetService';
import { Sweet } from '../models/Sweet';

jest.mock('../models/Sweet');

describe('SweetService', () => {
  let sweetService: SweetService;

  beforeEach(() => {
    sweetService = new SweetService();
    jest.clearAllMocks();
  });

  describe('createSweet', () => {
    it('should create a new sweet successfully', async () => {
      const sweetData = {
        name: 'Chocolate Bar',
        category: 'Chocolate',
        price: 2.5,
        quantity: 100
      };

      const mockSweet = { _id: 'sweet123', ...sweetData };
      (Sweet.create as jest.Mock).mockResolvedValue(mockSweet);

      const result = await sweetService.createSweet(sweetData);

      expect(Sweet.create).toHaveBeenCalledWith(sweetData);
      expect(result).toEqual(mockSweet);
    });
  });

  describe('getAllSweets', () => {
    it('should return all sweets', async () => {
      const mockSweets = [
        { _id: '1', name: 'Candy', category: 'Hard Candy', price: 1.5, quantity: 50 },
        { _id: '2', name: 'Chocolate', category: 'Chocolate', price: 2.5, quantity: 30 }
      ];

      (Sweet.find as jest.Mock).mockResolvedValue(mockSweets);

      const result = await sweetService.getAllSweets();

      expect(Sweet.find).toHaveBeenCalled();
      expect(result).toEqual(mockSweets);
    });
  });

  describe('searchSweets', () => {
    it('should search sweets by name', async () => {
      const mockSweets = [
        { name: 'Chocolate Bar', category: 'Chocolate', price: 2.5 }
      ];

      (Sweet.find as jest.Mock).mockResolvedValue(mockSweets);

      const result = await sweetService.searchSweets({ name: 'Chocolate' });

      expect(Sweet.find).toHaveBeenCalledWith({
        name: { $regex: 'Chocolate', $options: 'i' }
      });
      expect(result).toEqual(mockSweets);
    });

    it('should search sweets by price range', async () => {
      const mockSweets = [
        { name: 'Candy', price: 1.5 }
      ];

      (Sweet.find as jest.Mock).mockResolvedValue(mockSweets);

      await sweetService.searchSweets({ minPrice: 1, maxPrice: 2 });

      expect(Sweet.find).toHaveBeenCalledWith({
        price: { $gte: 1, $lte: 2 }
      });
    });
  });

  describe('purchaseSweet', () => {
    it('should decrease quantity when purchasing sweet', async () => {
      const mockSweet = {
        _id: 'sweet123',
        name: 'Candy',
        quantity: 10,
        save: jest.fn().mockResolvedValue(true)
      };

      (Sweet.findById as jest.Mock).mockResolvedValue(mockSweet);

      await sweetService.purchaseSweet('sweet123', 2);

      expect(mockSweet.quantity).toBe(8);
      expect(mockSweet.save).toHaveBeenCalled();
    });

    it('should throw error if insufficient stock', async () => {
      const mockSweet = {
        _id: 'sweet123',
        quantity: 1
      };

      (Sweet.findById as jest.Mock).mockResolvedValue(mockSweet);

      await expect(
        sweetService.purchaseSweet('sweet123', 5)
      ).rejects.toThrow('Insufficient stock');
    });

    it('should throw error if sweet not found', async () => {
      (Sweet.findById as jest.Mock).mockResolvedValue(null);

      await expect(
        sweetService.purchaseSweet('nonexistent', 1)
      ).rejects.toThrow('Sweet not found');
    });
  });

  describe('restockSweet', () => {
    it('should increase quantity when restocking', async () => {
      const mockSweet = {
        _id: 'sweet123',
        quantity: 5,
        save: jest.fn().mockResolvedValue(true)
      };

      (Sweet.findById as jest.Mock).mockResolvedValue(mockSweet);

      await sweetService.restockSweet('sweet123', 10);

      expect(mockSweet.quantity).toBe(15);
      expect(mockSweet.save).toHaveBeenCalled();
    });

    it('should throw error if sweet not found', async () => {
      (Sweet.findById as jest.Mock).mockResolvedValue(null);

      await expect(
        sweetService.restockSweet('nonexistent', 10)
      ).rejects.toThrow('Sweet not found');
    });
  });

  describe('deleteSweet', () => {
    it('should delete sweet successfully', async () => {
      const mockSweet = { _id: 'sweet123', name: 'Candy' };
      (Sweet.findByIdAndDelete as jest.Mock).mockResolvedValue(mockSweet);

      const result = await sweetService.deleteSweet('sweet123');

      expect(Sweet.findByIdAndDelete).toHaveBeenCalledWith('sweet123');
      expect(result).toEqual(mockSweet);
    });
  });
});
