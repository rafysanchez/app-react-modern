import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import { Product } from '../../types/product.types';
import './ProductDetailPage.css';
import LoadingSpinner from '../shared/LoadingSpinner';

const ProductDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const { getById, loading, error } = useProducts();
    const [product, setProduct] = useState<Product | null>(null);

    useEffect(() => {
        if (id) {
            getById(Number(id)).then(setProduct);
        }
    }, [id, getById]);

    if (loading) return <LoadingSpinner label="Loading product details..." />;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (!product) return <p>Product not found.</p>;

    return (
        <div className="product-detail-card">
            <h1>{product.name}</h1>
            <p><strong>SKU:</strong> {product.sku}</p>
            <p><strong>Category:</strong> {product.category}</p>
            <p><strong>Price:</strong> ${product.price.toFixed(2)}</p>
            <p><strong>Stock:</strong> {product.inventory}</p>
            <p><strong>Status:</strong> {product.status}</p>
            {product.description && <p><strong>Description:</strong> {product.description}</p>}
        </div>
    );
};

export default ProductDetailPage;
