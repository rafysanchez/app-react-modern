import { useState, useCallback } from 'react';
import { Product } from '../types/product.types';
import { productService } from '../services/product.service';
import { useNotification } from './useNotification';

export const useProducts = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const { success, error: notifyError } = useNotification();

    const hasNextPage = currentPage * pageSize < total;

    const getAll = useCallback(async (page: number, query: string = '') => {
        setLoading(true);
        setError(null);
        try {
            const { products: fetchedProducts, total: totalCount } = await productService.getAll(page, pageSize, query);
            setProducts(fetchedProducts);
            setTotal(totalCount);
            setCurrentPage(page);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch products');
            notifyError('Failed to fetch products');
        } finally {
            setLoading(false);
        }
    }, [pageSize, notifyError]);

    const getById = useCallback(async (id: number) => {
        setLoading(true);
        setError(null);
        try {
            return await productService.getById(id);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch product');
            notifyError('Failed to fetch product');
            return null;
        } finally {
            setLoading(false);
        }
    }, [notifyError]);

    const create = useCallback(async (product: Omit<Product, 'id'>) => {
        setLoading(true);
        setError(null);
        try {
            const newProduct = await productService.create(product);
            await getAll(1); // Refresh list
            success('Product created successfully');
            return newProduct;
        } catch (err: any) {
            setError(err.message || 'Failed to create product');
            notifyError('Failed to create product');
            return null;
        } finally {
            setLoading(false);
        }
    }, [getAll, notifyError, success]);

    const update = useCallback(async (id: number, product: Partial<Product>) => {
        setLoading(true);
        setError(null);
        try {
            const updatedProduct = await productService.update(id, product);
            await getAll(currentPage); // Refresh list
            success('Product updated successfully');
            return updatedProduct;
        } catch (err: any) {
            setError(err.message || 'Failed to update product');
            notifyError('Failed to update product');
            return null;
        } finally {
            setLoading(false);
        }
    }, [currentPage, getAll, notifyError, success]);

    const deleteProduct = useCallback(async (id: number) => {
        setLoading(true);
        setError(null);
        try {
            await productService.delete(id);
            await getAll(1); // Refresh list to first page
            success('Product deleted successfully');
            return true;
        } catch (err: any) {
            setError(err.message || 'Failed to delete product');
            notifyError('Failed to delete product');
            return false;
        } finally {
            setLoading(false);
        }
    }, [getAll, notifyError, success]);
    
    const search = useCallback(async (query: string) => {
        await getAll(1, query);
    }, [getAll]);

    return {
        products,
        loading,
        error,
        currentPage,
        pageSize,
        total,
        hasNextPage,
        getAll,
        getById,
        create,
        update,
        deleteProduct,
        search,
    };
};
