import React from 'react';
import Link from 'next/link';

export default function SweetsPage() {
  return (
    <div className="container" style={{ padding: 'var(--space-md) var(--space-xl)', paddingBottom: 'var(--space-4xl)', minHeight: '60vh' }}>
      <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: 'var(--space-md)' }}>
        <Link href="/">Home</Link> &gt; <span>Sweets</span>
      </div>
      
      <div style={{ textAlign: 'center', padding: 'var(--space-4xl) 0' }}>
        <h1 style={{ fontSize: '3rem', color: 'var(--secondary)', marginBottom: 'var(--space-sm)' }}>Traditional Sweets</h1>
        <p style={{ color: '#666', marginBottom: 'var(--space-xl)', maxWidth: '600px', margin: '0 auto' }}>
          Delicious, authentic sweets made with love and tradition. Perfect for offerings and sharing joy with loved ones.
        </p>
        <div style={{ padding: 'var(--space-2xl)', background: '#FFF1E6', borderRadius: 'var(--radius-lg)', display: 'inline-block' }}>
          <p style={{ fontWeight: 600, color: 'var(--primary)' }}>Products coming soon!</p>
        </div>
      </div>
    </div>
  );
}
