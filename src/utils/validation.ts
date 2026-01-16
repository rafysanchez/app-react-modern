import { z } from 'zod';

// Product validation schema
export const productSchema = z.object({
    name: z.string().min(1, 'Product name is required'),
    sku: z.string().min(1, 'SKU is required'),
    category: z.string().min(1, 'Category is required'),
    status: z.enum(['active', 'draft', 'archived']),
    price: z.number().positive('Price must be greater than 0'),
    inventory: z.number().nonnegative('Stock cannot be negative'),
    description: z.string().max(500, 'Description must not exceed 500 characters').optional(),
});

export type ProductSchema = z.infer<typeof productSchema>;

// Login validation schema
export const loginSchema = z.object({
    email: z.string().email('Invalid email address').min(1, 'Email is required'),
    password: z.string().min(1, 'Password is required'),
});

export type LoginSchema = z.infer<typeof loginSchema>;

// Utility function to validate email format
export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Utility function to validate price
export const isValidPrice = (price: number): boolean => {
    return price > 0 && !isNaN(price);
};

// Utility function to validate inventory
export const isValidInventory = (inventory: number): boolean => {
    return inventory >= 0 && Number.isInteger(inventory);
};

// Utility function to validate SKU format
export const isValidSku = (sku: string): boolean => {
    return sku.length > 0 && sku.length <= 50;
};
