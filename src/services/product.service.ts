import apiClient from './api/apiClient';
import { Product } from '../types/product.types';

const getAll = async (page: number = 1, limit: number = 10, query: string = ''): Promise<{products: Product[], total: number}> => {
    const params = new URLSearchParams({
        _page: page.toString(),
        _limit: limit.toString(),
    });
    if (query) {
        params.append('q', query);
    }
    const response = await apiClient.get(`/products?${params.toString()}`);
    const total = Number(response.headers['x-total-count']);
    return { products: response.data, total };
};

const getById = async (id: number): Promise<Product | null> => {
  const { data } = await apiClient.get(`/products/${id}`);
  return data;
};

const create = async (product: Omit<Product, 'id'>): Promise<Product | null> => {
  const { data } = await apiClient.post('/products', product);
  return data;
};

const update = async (id: number, product: Partial<Product>): Promise<Product | null> => {
  const { data } = await apiClient.put(`/products/${id}`, product);
  return data;
};

const deleteById = async (id: number): Promise<boolean> => {
  await apiClient.delete(`/products/${id}`);
  return true;
};

const search = async (query: string): Promise<Product[]> => {
    const { data } = await apiClient.get(`/products?q=${query}`);
    return data;
}

export const productService = {
  getAll,
  getById,
  create,
  update,
  delete: deleteById,
  search,
};
