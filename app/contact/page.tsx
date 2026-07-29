import React from 'react';
import { Button } from '../../components/ui/Button';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="container" style={{ padding: 'var(--space-4xl) 0', minHeight: '60vh' }}>
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-4xl)' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: 'var(--space-sm)' }}>Contact & Support</h1>
        <p style={{ color: '#666', maxWidth: '600px', margin: '0 auto' }}>We&apos;re here to help make your celebrations perfect. Reach out to us with any questions about your orders, our products, or corporate gifting.</p>
      </div>

      <div style={{ display: 'grid', gap: 'var(--space-4xl)' }} className="md:grid-cols-2">
        <style dangerouslySetInnerHTML={{__html: `
          @media (min-width: 768px) {
            .md\\:grid-cols-2 { grid-template-columns: 1fr 1fr !important; }
          }
        `}} />

        {/* Contact Form */}
        <div style={{ background: 'var(--surface)', padding: 'var(--space-2xl)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-lg)' }}>Send us a Message</h2>
          <form style={{ display: 'grid', gap: 'var(--space-md)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '4px' }}>First Name</label>
                <input type="text" required style={{ width: '100%', padding: 'var(--space-sm) var(--space-md)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '4px' }}>Last Name</label>
                <input type="text" required style={{ width: '100%', padding: 'var(--space-sm) var(--space-md)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }} />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '4px' }}>Email Address</label>
              <input type="email" required style={{ width: '100%', padding: 'var(--space-sm) var(--space-md)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '4px' }}>Order Number (Optional)</label>
              <input type="text" style={{ width: '100%', padding: 'var(--space-sm) var(--space-md)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '4px' }}>Message</label>
              <textarea rows={4} required style={{ width: '100%', padding: 'var(--space-sm) var(--space-md)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}></textarea>
            </div>
            <Button type="submit" variant="primary" style={{ marginTop: 'var(--space-sm)' }}>Send Message</Button>
          </form>
        </div>

        {/* Contact Info & FAQs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2xl)' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-lg)' }}>Get in Touch</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-md)' }}>
                <div style={{ background: 'rgba(255,123,0,0.1)', color: 'var(--primary)', padding: '12px', borderRadius: '50%' }}><Mail size={24} /></div>
                <div>
                  <h3 style={{ fontSize: '1.125rem', marginBottom: '4px' }}>Email</h3>
                  <p style={{ color: '#666' }}>support@celbrico.in</p>
                  <p style={{ color: '#999', fontSize: '0.875rem' }}>We aim to reply within 24 hours.</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-md)' }}>
                <div style={{ background: 'rgba(255,123,0,0.1)', color: 'var(--primary)', padding: '12px', borderRadius: '50%' }}><Phone size={24} /></div>
                <div>
                  <h3 style={{ fontSize: '1.125rem', marginBottom: '4px' }}>Phone</h3>
                  <p style={{ color: '#666' }}>1-800-CELBRICO</p>
                  <p style={{ color: '#999', fontSize: '0.875rem' }}>Mon-Fri, 9am - 6pm IST</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-md)' }}>
                <div style={{ background: 'rgba(255,123,0,0.1)', color: 'var(--primary)', padding: '12px', borderRadius: '50%' }}><MapPin size={24} /></div>
                <div>
                  <h3 style={{ fontSize: '1.125rem', marginBottom: '4px' }}>Headquarters</h3>
                  <p style={{ color: '#666' }}>123 Festival Avenue, Celebration Hub<br />New Delhi, DL 110001, India</p>
                </div>
              </div>
            </div>
          </div>

          <div style={{ background: 'var(--surface-hover)', padding: 'var(--space-lg)', borderRadius: 'var(--radius-xl)' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-md)' }}>Frequently Asked Questions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
              <details style={{ background: 'var(--surface)', padding: 'var(--space-sm) var(--space-md)', borderRadius: 'var(--radius-md)' }}>
                <summary style={{ fontWeight: 500, cursor: 'pointer' }}>What is your return policy?</summary>
                <p style={{ color: '#666', marginTop: 'var(--space-sm)', fontSize: '0.875rem', lineHeight: 1.5 }}>We accept returns within 7 days of delivery for unused items in original packaging. Food and perishable items cannot be returned.</p>
              </details>
              <details style={{ background: 'var(--surface)', padding: 'var(--space-sm) var(--space-md)', borderRadius: 'var(--radius-md)' }}>
                <summary style={{ fontWeight: 500, cursor: 'pointer' }}>Do you offer international shipping?</summary>
                <p style={{ color: '#666', marginTop: 'var(--space-sm)', fontSize: '0.875rem', lineHeight: 1.5 }}>Currently, we only ship within India. We plan to expand to international markets soon.</p>
              </details>
              <details style={{ background: 'var(--surface)', padding: 'var(--space-sm) var(--space-md)', borderRadius: 'var(--radius-md)' }}>
                <summary style={{ fontWeight: 500, cursor: 'pointer' }}>Can I customize a hamper for corporate gifting?</summary>
                <p style={{ color: '#666', marginTop: 'var(--space-sm)', fontSize: '0.875rem', lineHeight: 1.5 }}>Yes, we have a dedicated corporate gifting team. Please fill out the contact form and select &quot;Corporate Gifting&quot; as the subject.</p>
              </details>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
