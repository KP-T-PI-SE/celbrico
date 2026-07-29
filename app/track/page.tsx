'use client';
import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { Search, Package, Truck, CheckCircle } from 'lucide-react';

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSearching(true);
    // Simulate network request
    setTimeout(() => {
      setIsSearching(false);
      setHasSearched(true);
    }, 1000);
  };

  // Check URL params on load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (id) {
      setTimeout(() => {
        setOrderId(id);
        handleSearch();
      }, 0);
    }
  }, []);

  return (
    <div className="container" style={{ padding: 'var(--space-4xl) 0', minHeight: '60vh', maxWidth: '800px' }}>
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-4xl)' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: 'var(--space-sm)' }}>Track Your Order</h1>
        <p style={{ color: '#666' }}>Enter your order ID below to see real-time updates.</p>
      </div>

      <form onSubmit={handleSearch} style={{ display: 'flex', gap: 'var(--space-sm)', marginBottom: 'var(--space-4xl)', maxWidth: '500px', margin: '0 auto var(--space-4xl) auto' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
          <input 
            type="text" 
            placeholder="e.g., ORDER12345" 
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            required
            style={{ width: '100%', padding: 'var(--space-sm) var(--space-md) var(--space-sm) 48px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border)', background: 'var(--surface)' }}
          />
        </div>
        <Button type="submit" variant="primary" isLoading={isSearching}>Track</Button>
      </form>

      {hasSearched && (
        <div className="animate-fade-up">
          <div style={{ background: 'var(--surface)', padding: 'var(--space-2xl)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2xl)', paddingBottom: 'var(--space-md)', borderBottom: '1px solid var(--border)' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '4px' }}>Order #{orderId || 'ORDER12345'}</h3>
                <span style={{ color: '#666', fontSize: '0.875rem' }}>Placed on Oct 24, 2026</span>
              </div>
              <span style={{ background: 'rgba(255, 123, 0, 0.1)', color: 'var(--primary)', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontWeight: 600, fontSize: '0.875rem' }}>In Transit</span>
            </div>

            {/* Tracking Timeline */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
              <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ background: 'var(--primary)', color: 'white', padding: '8px', borderRadius: '50%' }}><Package size={20} /></div>
                  <div style={{ width: '2px', height: '100%', background: 'var(--primary)', margin: '8px 0' }}></div>
                </div>
                <div>
                  <h4 style={{ fontSize: '1.125rem' }}>Order Confirmed</h4>
                  <p style={{ color: '#666', fontSize: '0.875rem' }}>Oct 24, 10:30 AM</p>
                  <p style={{ color: '#555', marginTop: '4px' }}>Your order has been placed successfully and is being prepared.</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ background: 'var(--primary)', color: 'white', padding: '8px', borderRadius: '50%' }}><Truck size={20} /></div>
                  <div style={{ width: '2px', height: '100%', background: 'var(--border)', margin: '8px 0' }}></div>
                </div>
                <div>
                  <h4 style={{ fontSize: '1.125rem' }}>Shipped</h4>
                  <p style={{ color: '#666', fontSize: '0.875rem' }}>Oct 25, 08:15 AM</p>
                  <p style={{ color: '#555', marginTop: '4px' }}>Your package is with the courier partner and on its way.</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ background: 'var(--surface)', border: '2px solid var(--border)', color: '#999', padding: '8px', borderRadius: '50%' }}><CheckCircle size={20} /></div>
                </div>
                <div style={{ opacity: 0.5 }}>
                  <h4 style={{ fontSize: '1.125rem' }}>Delivered</h4>
                  <p style={{ color: '#666', fontSize: '0.875rem' }}>Expected Oct 26</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
