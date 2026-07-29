import React from 'react';
import Link from 'next/link';
import { CheckSquare } from 'lucide-react';

export default function ChecklistPage() {
  return (
    <div className="container" style={{ padding: 'var(--space-md) var(--space-xl)', paddingBottom: 'var(--space-4xl)', minHeight: '60vh' }}>
      <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: 'var(--space-md)' }}>
        <Link href="/">Home</Link> &gt; <span>Checklist</span>
      </div>
      
      <div style={{ background: '#F0F9F5', borderRadius: 'var(--radius-xl)', padding: 'var(--space-2xl)', maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', color: 'var(--secondary)', marginBottom: 'var(--space-sm)' }}>Festival Checklist</h1>
        <p style={{ color: '#666', marginBottom: 'var(--space-xl)' }}>Your complete guide to making sure you have everything ready for the pooja.</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          {[
            'Pooja Samagri (Kumkum, Haldi, Camphor)',
            'Fresh Flowers & Garlands',
            'Sweets & Modak Ingredients',
            'Fresh Fruits',
            'Pure Cow Ghee',
            'Incense Sticks & Dhoop',
            'Pooja Thali & Kalash',
            'Prasad Items',
            'Decorations (Rangoli, Diyas)'
          ].map((item, i) => (
            <label key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1rem', color: 'var(--text-dark)', cursor: 'pointer', background: 'white', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              <input type="checkbox" style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }} />
              {item}
            </label>
          ))}
        </div>
        
        <div style={{ marginTop: 'var(--space-2xl)', textAlign: 'center' }}>
          <Link href="/shop" style={{ background: 'var(--primary)', color: 'white', padding: '12px 24px', borderRadius: 'var(--radius-sm)', fontWeight: 600, display: 'inline-block' }}>
            Shop Missing Items
          </Link>
        </div>
      </div>
    </div>
  );
}
