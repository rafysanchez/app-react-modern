import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Product } from '../../types/product.types';
import './Modal.css';
import { useEffect } from 'react';

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  sku: z.string().min(1, "SKU is required"),
  category: z.string().min(1, "Category is required"),
  status: z.enum(["active", "draft", "archived"]),
  price: z.number().positive("Price must be greater than 0"),
  inventory: z.number().nonnegative("Stock cannot be negative"),
  description: z.string().max(500).optional(),
});

type ProductFormInputs = z.infer<typeof productSchema>;

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onSave: (product: ProductFormInputs, id?: number) => void;
}

const ProductModal = ({ product, onClose, onSave }: ProductModalProps) => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ProductFormInputs>({
    resolver: zodResolver(productSchema),
    defaultValues: product ? {
        ...product,
        price: Number(product.price),
        inventory: Number(product.inventory)
    } : { status: "active", price: 0, inventory: 0 },
  });

  useEffect(() => {
    if (product) {
      reset({
          ...product,
          price: Number(product.price),
          inventory: Number(product.inventory)
      });
    } else {
        reset({ name: '', sku: '', category: '', status: 'active', price: 0, inventory: 0, description: '' });
    }
  }, [product, reset]);

  const onSubmit = (data: ProductFormInputs) => {
    onSave(data, product?.id);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>{product ? 'Edit Product' : 'Add Product'}</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label>Product Name*</label>
            <input {...register('name')} />
            {errors.name && <p>{errors.name.message}</p>}
          </div>
          <div>
            <label>SKU*</label>
            <input {...register('sku')} />
            {errors.sku && <p>{errors.sku.message}</p>}
          </div>
          <div>
            <label>Category*</label>
            <input {...register('category')} />
            {errors.category && <p>{errors.category.message}</p>}
          </div>
          <div>
            <label>Status*</label>
            <select {...register('status')}>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div>
            <label>Price*</label>
            <input type="number" {...register('price', { valueAsNumber: true })} />
            {errors.price && <p>{errors.price.message}</p>}
          </div>
          <div>
            <label>Stock*</label>
            <input type="number" {...register('inventory', { valueAsNumber: true })} />
            {errors.inventory && <p>{errors.inventory.message}</p>}
          </div>
          <div>
            <label>Description</label>
            <textarea {...register('description')} />
            {errors.description && <p>{errors.description.message}</p>}
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose} disabled={isSubmitting}>Cancel</button>
            <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
