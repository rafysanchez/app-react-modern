import { useEffect, useState } from 'react';
import { useProducts } from '../../hooks/useProducts';
import ProductTable from './ProductTable';
import './ProductsPage.css';
import { Product } from '../../types/product.types';
import { useDebounce } from '../../hooks/useDebounce';
import ProductModal from '../shared/ProductModal';
import ConfirmDialog from '../shared/ConfirmDialog';
import LoadingSpinner from '../shared/LoadingSpinner';

type ProductFormInputs = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;

const ProductsPage = () => {
    const { products, loading, error, currentPage, hasNextPage, getAll, search, create, update, deleteProduct } = useProducts();
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

    useEffect(() => {
        if (debouncedSearchTerm) {
            search(debouncedSearchTerm);
        } else {
            getAll(1);
        }
    }, [debouncedSearchTerm, search, getAll]);

    const handleNextPage = () => {
        if (hasNextPage) {
            getAll(currentPage + 1, searchTerm);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            getAll(currentPage - 1, searchTerm);
        }
    };

    const handleAdd = () => {
        setEditingProduct(null);
        setIsModalOpen(true);
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleDelete = (product: Product) => {
        setDeletingProduct(product);
        setIsConfirmOpen(true);
    };

    const handleSave = async (data: ProductFormInputs, id?: number) => {
        if (id) {
            await update(id, data);
        } else {
            await create(data);
        }
        setIsModalOpen(false);
    };

    const handleConfirmDelete = async () => {
        if (deletingProduct) {
            await deleteProduct(deletingProduct.id);
            setIsConfirmOpen(false);
            setDeletingProduct(null);
        }
    };
    
    return (
        <div className="products-page">
            <header className="products-page-header">
                <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                <button onClick={handleAdd} className="add-product-btn">+ Add Product</button>
            </header>

            {loading && products.length === 0 && <LoadingSpinner label="Loading products..." />}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            
            {!loading && !error && products.length === 0 && (
                <div className="empty-state">
                    <p>No products found</p>
                    <button onClick={handleAdd} className="add-product-btn">+ Add Product</button>
                </div>
            )}

            {!loading && !error && products.length > 0 && (
                <>
                    <ProductTable products={products} onEdit={handleEdit} onDelete={handleDelete} />
                    <div className="pagination">
                        <button onClick={handlePrevPage} disabled={currentPage <= 1 || loading}>Previous</button>
                        <span>Page {currentPage}</span>
                        <button onClick={handleNextPage} disabled={!hasNextPage || loading}>Next</button>
                    </div>
                </>
            )}

            {isModalOpen && (
                <ProductModal 
                    product={editingProduct}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSave}
                />
            )}

            {isConfirmOpen && (
                <ConfirmDialog
                    message={`Are you sure you want to delete ${deletingProduct?.name}?`}
                    onCancel={() => setIsConfirmOpen(false)}
                    onConfirm={handleConfirmDelete}
                    isLoading={loading}
                />
            )}
        </div>
    );
};

export default ProductsPage;
