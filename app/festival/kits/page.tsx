'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Heart } from 'lucide-react';

export default function PoojaKitsPage() {
  const [priceRange, setPriceRange] = useState(5000);

  const kits = [
    { name: 'Ganesh Chaturthi Kit', items: 22, price: 699, original: 899, off: '22% OFF', tag: 'Bestseller' },
    { name: 'Diwali Pooja Kit', items: 28, price: 899, original: 1199, off: '25% OFF', tag: 'Popular' },
    { name: 'Navratri Pooja Kit', items: 27, price: 799, original: 999, off: '20% OFF', tag: 'Bestseller' },
    { name: 'Satyanarayan Pooja Kit', items: 30, price: 549, original: 699, off: '21% OFF', tag: 'New' },
    { name: 'Griha Pravesh Kit', items: 26, price: 1199, original: 1599, off: '25% OFF', tag: 'New' },
    { name: 'Lakshmi Pooja Kit', items: 24, price: 649, original: 799, off: '19% OFF', tag: 'Bestseller' },
    { name: 'Sankranti Kit', items: 20, price: 499, original: 649, off: '23% OFF', tag: 'Popular' },
    { name: 'Daily Pooja Kit', items: 18, price: 399, original: 499, off: '20% OFF', tag: 'New' }
  ];

  return (
    <div className="container" style={{ padding: 'var(--space-md) var(--space-xl)', paddingBottom: 'var(--space-4xl)' }}>
      {/* Breadcrumb */}
      <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: 'var(--space-md)' }}>
        <Link href="/">Home</Link> &gt; <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Pooja Kits</span>
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-2xl)' }}>
        
        {/* Left Sidebar */}
        <aside style={{ width: '220px', flexShrink: 0 }} className="hidden md:block">
          <h1 style={{ fontSize: '2.5rem', color: 'var(--secondary)', marginBottom: 'var(--space-xs)' }}>Pooja Kits</h1>
          <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: 'var(--space-xl)' }}>Everything you need for a perfect pooja, neatly packed and delivered to your doorstep.</p>

          {/* Categories Filter */}
          <div style={{ marginBottom: 'var(--space-lg)' }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--secondary)', marginBottom: 'var(--space-sm)' }}>Categories</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.875rem', color: '#444' }}>
              <Link href="#" style={{ color: 'var(--primary)', fontWeight: 600, background: '#FFF1E6', padding: '4px 8px', borderRadius: '4px', margin: '0 -8px' }}>All Kits</Link>
              <Link href="#">Ganesh Chaturthi</Link>
              <Link href="#">Diwali</Link>
              <Link href="#">Navratri</Link>
              <Link href="#">Satyanarayan Pooja</Link>
              <Link href="#">Griha Pravesh</Link>
              <Link href="#">Lakshmi Pooja</Link>
              <Link href="#">Sankranti</Link>
              <Link href="#">Daily Pooja</Link>
              <Link href="#">Others</Link>
            </div>
          </div>

          {/* Price Range Filter */}
          <div style={{ marginBottom: 'var(--space-lg)' }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--secondary)', marginBottom: 'var(--space-sm)' }}>Price Range</h4>
            <input type="range" min="199" max="5000" value={priceRange} onChange={(e) => setPriceRange(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--primary)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#666', marginTop: '4px' }}>
              <span>₹199</span><span>₹{priceRange.toLocaleString()}+</span>
            </div>
          </div>

          {/* Kit Type Filter */}
          <div style={{ marginBottom: 'var(--space-lg)' }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--secondary)', marginBottom: 'var(--space-sm)' }}>Kit Type</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.875rem', color: '#444' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" /> Basic</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" /> Standard</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" /> Premium</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" /> Deluxe</label>
            </div>
          </div>

          {/* Includes Filter */}
          <div style={{ marginBottom: 'var(--space-lg)' }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--secondary)', marginBottom: 'var(--space-sm)' }}>Includes</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.875rem', color: '#444' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" /> Samagri</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" /> Pooja Thali</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" /> Instructions</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" /> Prasad Items</label>
            </div>
          </div>
        </aside>

        {/* Right Content */}
        <div style={{ flex: 1 }}>
          
          {/* Top Banner */}
          <div style={{ width: '100%', height: '140px', background: '#FFF7ED', borderRadius: 'var(--radius-lg)', display: 'flex', position: 'relative', overflow: 'hidden', marginBottom: 'var(--space-xl)' }}>
            {/* Background image on the left, fade out to right */}
            <div style={{ flex: 1, background: 'linear-gradient(to right, #FFD1B3, #FFF7ED 80%)' }}></div>
            <div style={{ flex: 1.5, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 'var(--space-xl)' }}>
               <h2 style={{ color: 'var(--secondary)', fontSize: '1.5rem', marginBottom: '4px' }}>Complete Pooja Solutions</h2>
               <p style={{ color: 'var(--secondary)', fontSize: '0.875rem' }}>Authentic items &bull; Perfectly packed &bull; Delivered with care</p>
            </div>
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
            <span style={{ fontSize: '0.875rem', color: '#666' }}>Showing 1-12 of 48 kits</span>
            <div style={{ fontSize: '0.875rem', color: '#444' }}>
              Sort by: <span style={{ fontWeight: 600 }}>Popular <ChevronDown size={14} style={{ display: 'inline' }} /></span>
            </div>
          </div>

          {/* Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 'var(--space-lg)', marginBottom: 'var(--space-3xl)' }}>
            {kits.map((kit, i) => (
              <div key={i} style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', padding: 'var(--space-md)', position: 'relative', display: 'flex', flexDirection: 'column' }}>
                {kit.tag && <div style={{ position: 'absolute', top: '12px', left: '12px', background: kit.tag === 'Bestseller' ? '#E65100' : kit.tag === 'New' ? '#8E24AA' : '#4CAF50', color: 'white', fontSize: '0.6rem', padding: '2px 8px', borderRadius: 'var(--radius-sm)', zIndex: 2 }}>{kit.tag}</div>}
                <button style={{ position: 'absolute', top: '12px', right: '12px', color: '#D32F2F', background: 'none', zIndex: 2 }}><Heart size={18} /></button>
                
                <div style={{ width: '100%', height: '140px', background: '#FFF1E6', borderRadius: 'var(--radius-sm)', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {/* Image Placeholder */}
                </div>
                
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--secondary)', marginBottom: '4px' }}>{kit.name}</h3>
                <p style={{ fontSize: '0.75rem', color: '#666', marginBottom: '12px' }}>{kit.items} Items</p>
                
                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
                  <span style={{ fontWeight: 700, fontSize: '1.25rem', color: 'var(--secondary)' }}>₹{kit.price}</span>
                  <span style={{ textDecoration: 'line-through', color: '#999', fontSize: '0.75rem' }}>₹{kit.original}</span>
                  <span style={{ color: '#2E7D32', fontSize: '0.75rem', fontWeight: 600 }}>{kit.off}</span>
                </div>
                
                <button style={{ width: '100%', background: 'white', border: '1px solid var(--primary)', color: 'var(--primary)', borderRadius: 'var(--radius-sm)', padding: '8px', fontSize: '0.875rem', fontWeight: 600 }}>Add to Cart</button>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', alignItems: 'center' }}>
            <button style={{ padding: '8px', color: '#999' }}>&larr;</button>
            <button style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--primary)', color: 'white', borderRadius: '4px', fontWeight: 600, fontSize: '0.875rem' }}>1</button>
            <button style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', color: '#666', borderRadius: '4px', fontSize: '0.875rem' }}>2</button>
            <button style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', color: '#666', borderRadius: '4px', fontSize: '0.875rem' }}>3</button>
            <button style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', color: '#666', borderRadius: '4px', fontSize: '0.875rem' }}>4</button>
            <button style={{ padding: '8px', color: 'var(--primary)' }}>&rarr;</button>
          </div>

        </div>
      </div>
    </div>
  );
}
