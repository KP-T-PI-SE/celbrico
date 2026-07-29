import React from 'react';
import { ProductCard, Product } from '../../../components/ui/ProductCard';

const FESTIVAL_PRODUCTS: Product[] = [
  { id: '1', name: 'Premium Diwali Hamper', price: 2999, originalPrice: 3499, category: 'Hampers', image: '/images/hamper.jpg' },
  { id: '2', name: 'Handcrafted Diyas (Set of 6)', price: 499, category: 'Decor', image: '/images/diyas.jpg' },
  { id: '3', name: 'Assorted Mithai Box', price: 899, category: 'Sweets', image: '/images/mithai.jpg' },
  { id: '4', name: 'Saffron & Gold Puja Thali', price: 1299, originalPrice: 1599, category: 'Essentials', image: '/images/thali.jpg' },
];

export default async function FestivalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const festivalName = id.charAt(0).toUpperCase() + id.slice(1);
  
  return (
    <div>
      {/* Festival Hero Banner */}
      <section style={{ position: 'relative', background: 'var(--secondary)', color: 'white', padding: 'var(--space-4xl) 0', overflow: 'hidden' }}>
        <div className="container" style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: 'var(--space-sm)' }}>
            The {festivalName} Store
          </h1>
          <p style={{ fontSize: '1.25rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto' }}>
            Everything you need for a memorable, premium {festivalName} celebration.
          </p>
        </div>
        {/* Decorative elements */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.1, background: 'radial-gradient(circle at 50% 120%, rgba(212, 175, 55, 1) 0%, rgba(0,0,0,0) 60%)' }}></div>
      </section>

      {/* Festival Collection */}
      <section className="container" style={{ padding: 'var(--space-4xl) 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-2xl)' }}>
          <h2 style={{ fontSize: '2rem' }}>Exclusive Collection</h2>
          <select style={{ padding: 'var(--space-sm)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
            <option>Featured</option>
            <option>Best Selling</option>
            <option>New Arrivals</option>
          </select>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 'var(--space-lg)' }}>
          {FESTIVAL_PRODUCTS.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
      
      {/* Celebration Guide / Content Block */}
      <section style={{ background: 'var(--surface-hover)', padding: 'var(--space-4xl) 0' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '800px' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: 'var(--space-md)' }}>Celebrate with Celbrico</h2>
          <p style={{ color: '#666', lineHeight: 1.6, marginBottom: 'var(--space-xl)' }}>
            Our curated {festivalName} collection is designed to bring you the highest quality traditional items wrapped in modern luxury. From handcrafted essentials to premium gifting options, we&apos;ve sourced the best so you can focus on what matters most: celebrating with your loved ones.
          </p>
        </div>
      </section>
    </div>
  );
}
