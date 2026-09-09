import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Product from '../models/Product';
import Category from '../models/Category';

// Get products with optional search, category filter, and sorting
export const getProducts = async (req: Request, res: Response) => {
  try {
    const { category, search, sort, limit } = req.query;
    const filter: any = { isActive: true };

    if (category) {
      if (mongoose.Types.ObjectId.isValid(category as string)) {
        filter.category = category;
      } else {
        const cat = await Category.findOne({ slug: category });
        if (cat) {
          filter.category = cat._id;
        }
      }
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search as string, $options: 'i' } },
        { description: { $regex: search as string, $options: 'i' } },
      ];
    }

    let query = Product.find(filter).populate('category', 'name slug');

    if (sort === 'price_asc') {
      query = query.sort({ price: 1 });
    } else if (sort === 'price_desc') {
      query = query.sort({ price: -1 });
    } else {
      query = query.sort({ createdAt: -1 });
    }

    if (limit) {
      query = query.limit(parseInt(limit as string, 10));
    }

    const products = await query;
    res.status(200).json({ success: true, count: products.length, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get single product by ID or slug
export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    let product;

    if (mongoose.Types.ObjectId.isValid(id)) {
      product = await Product.findById(id).populate('category', 'name slug');
    }

    if (!product) {
      product = await Product.findOne({ slug: id, isActive: true }).populate('category', 'name slug');
    }

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Create a new product (Admin only)
export const createProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Invalid data' });
  }
};
