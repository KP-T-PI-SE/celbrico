import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart } from 'lucide-react';
import { Button } from './Button';

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
}

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="glass" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <Link href={`/product/${product.id}`} style={{ position: 'relative', width: '100%', aspectRatio: '1/1', display: 'block', overflow: 'hidden' }}>
        {/* Placeholder styling since no actual image right now */}
        <div style={{ width: '100%', height: '100%', backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      </Link>
      <div style={{ padding: 'var(--space-md)', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: 'var(--space-xs)' }}>{product.category}</p>
        <h3 style={{ fontSize: '1.125rem', marginBottom: 'var(--space-sm)', flex: 1 }}>
          <Link href={`/product/${product.id}`}>{product.name}</Link>
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
          <div>
            <span style={{ fontWeight: '600', fontSize: '1.25rem', color: 'var(--primary)' }}>₹{product.price}</span>
            {product.originalPrice && (
              <span style={{ textDecoration: 'line-through', fontSize: '0.875rem', color: '#999', marginLeft: 'var(--space-xs)' }}>₹{product.originalPrice}</span>
            )}
          </div>
          <Button variant="primary" style={{ padding: '0.5rem', borderRadius: '50%' }} aria-label="Add to cart">
            <ShoppingCart size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
};
