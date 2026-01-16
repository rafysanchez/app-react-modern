import { Product } from '../../types/product.types';
import './ProductTable.css';

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

const ProductTable = ({ products, onEdit, onDelete }: ProductTableProps) => {
  const getStatusBadge = (status: Product['status']) => {
    switch (status) {
      case 'active':
        return <span className="badge-green">{status}</span>;
      case 'draft':
        return <span className="badge-yellow">{status}</span>;
      case 'archived':
        return <span className="badge-gray">{status}</span>;
      default:
        return <span className="badge-gray">{status}</span>;
    }
  };

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>SKU</th>
            <th>Category</th>
            <th>Status</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.sku}</td>
              <td>{product.category}</td>
              <td>{getStatusBadge(product.status)}</td>
              <td>${product.price.toFixed(2)}</td>
              <td>{product.inventory}</td>
              <td>
                <button onClick={() => onEdit(product)} className="action-btn edit-btn">✎</button>
                <button onClick={() => onDelete(product)} className="action-btn delete-btn">🗑</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
