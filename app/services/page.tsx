import React from 'react';
import Link from 'next/link';
import { UserCheck, Video, FileText, Award, HelpCircle, Calendar, CreditCard, Users, ShieldCheck, Clock, Headphones } from 'lucide-react';

export default function ServicesPage() {
  const services = [
    { name: 'Ganesh Pooja', price: 999, rating: 4.8, reviews: '1.2k+', img: 'ganesh' },
    { name: 'Griha Pravesh', price: 1499, rating: 4.9, reviews: '980+', img: 'griha' },
    { name: 'Satyanarayan Pooja', price: 799, rating: 4.8, reviews: '850+', img: 'satyanarayan' },
    { name: 'Navgraha Shanti', price: 2499, rating: 4.8, reviews: '760+', img: 'navgraha' },
    { name: 'Maha Shivratri Pooja', price: 999, rating: 4.9, reviews: '690+', img: 'shiv' },
    { name: 'Lakshmi Pooja', price: 1199, rating: 4.8, reviews: '630+', img: 'lakshmi' },
    { name: 'Pitru Paksha Pooja', price: 1299, rating: 4.7, reviews: '540+', img: 'pitru' },
    { name: 'Custom Pooja', price: 'As per requirement', rating: 4.9, reviews: '410+', img: 'custom' },
  ];

  return (
    <div className="container" style={{ padding: 'var(--space-md) var(--space-xl)', paddingBottom: 'var(--space-4xl)' }}>
      {/* Breadcrumb */}
      <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: 'var(--space-md)' }}>
        <Link href="/">Home</Link> &gt; <span>Al Daadi & Online Pandit</span>
      </div>

      {/* Hero Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 'var(--space-2xl)', marginBottom: 'var(--space-2xl)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h1 style={{ fontSize: '3.5rem', color: 'var(--secondary)', marginBottom: 'var(--space-md)', lineHeight: 1.1 }}>
            Guidance. Tradition. Blessings.
          </h1>
          <p style={{ fontSize: '1.125rem', color: '#666', maxWidth: '400px' }}>
            Everything you need to celebrate, learn and connect with divinity.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-lg)' }}>
          <div style={{ flex: 1, background: '#E8F5E9', borderRadius: 'var(--radius-xl)', padding: 'var(--space-xl)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '16px', right: '16px', background: 'white', color: '#2E7D32', fontSize: '0.75rem', padding: '4px 8px', borderRadius: 'var(--radius-sm)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{width: '6px', height: '6px', background: '#4CAF50', borderRadius: '50%'}}></div> 24/7 Available</div>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--secondary)', marginBottom: '4px' }}>Al Daadi</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--secondary)', fontWeight: 700, marginBottom: 'var(--space-md)' }}>Your Festival Guide</p>
            <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: 'var(--space-xl)', maxWidth: '200px' }}>Explore stories, traditions, rituals and significance of every festival.</p>
            <button style={{ background: '#2E7D32', color: 'white', padding: '8px 16px', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem', fontWeight: 600 }}>Chat with Daadi &rarr;</button>
          </div>

          <div style={{ flex: 1, background: '#FFF1E6', borderRadius: 'var(--radius-xl)', padding: 'var(--space-xl)', position: 'relative', overflow: 'hidden' }}>
             <div style={{ position: 'absolute', top: '16px', right: '16px', background: 'white', color: 'var(--primary)', fontSize: '0.75rem', padding: '4px 8px', borderRadius: 'var(--radius-sm)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}><UserCheck size={14}/> Verified Pandits</div>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--secondary)', marginBottom: '4px' }}>Online Pandit</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--secondary)', fontWeight: 700, marginBottom: 'var(--space-md)' }}>Live Pooja Services</p>
            <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: 'var(--space-xl)', maxWidth: '200px' }}>Book experienced pandits for your poojas and ceremonies from the comfort of home.</p>
            <button style={{ background: 'var(--primary)', color: 'white', padding: '8px 16px', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem', fontWeight: 600 }}>Book a Pandit &rarr;</button>
          </div>
        </div>
      </div>

      {/* Services Grid & Sidebar */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: 'var(--space-2xl)', marginBottom: 'var(--space-3xl)' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--secondary)' }}>Popular Pooja Services</h3>
            <Link href="/services/all" style={{ fontSize: '0.875rem', color: 'var(--primary)', fontWeight: 600 }}>View All Services &rarr;</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-lg)' }}>
            {services.map(s => (
              <div key={s.name} style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-md)', textAlign: 'center' }}>
                <div style={{ width: '80px', height: '80px', margin: '0 auto var(--space-sm)', background: '#F9F9F9', borderRadius: '50%' }}></div>
                <h4 style={{ fontSize: '0.875rem', color: 'var(--secondary)', fontWeight: 700, marginBottom: '4px' }}>{s.name}</h4>
                <p style={{ fontSize: '0.75rem', color: '#666', marginBottom: '4px' }}>{typeof s.price === 'number' ? `₹${s.price} onwards` : s.price}</p>
                <div style={{ fontSize: '0.75rem', color: '#666', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '4px' }}>
                  <span style={{ color: '#F59E0B' }}>★ {s.rating}</span> ({s.reviews})
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div style={{ background: '#FFFDF9', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-xl)', display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <div style={{ color: 'var(--primary)', background: '#FFF1E6', padding: '8px', borderRadius: '50%' }}><UserCheck size={20}/></div>
            <div>
              <h5 style={{ fontSize: '0.875rem', color: 'var(--secondary)' }}>Verified & Experienced Pandits</h5>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <div style={{ color: 'var(--primary)', background: '#FFF1E6', padding: '8px', borderRadius: '50%' }}><Video size={20}/></div>
            <div>
              <h5 style={{ fontSize: '0.875rem', color: 'var(--secondary)' }}>Live Pooja with HD Video</h5>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <div style={{ color: 'var(--primary)', background: '#FFF1E6', padding: '8px', borderRadius: '50%' }}><Award size={20}/></div>
            <div>
              <h5 style={{ fontSize: '0.875rem', color: 'var(--secondary)' }}>Sankalp in Your Name</h5>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <div style={{ color: 'var(--primary)', background: '#FFF1E6', padding: '8px', borderRadius: '50%' }}><FileText size={20}/></div>
            <div>
              <h5 style={{ fontSize: '0.875rem', color: 'var(--secondary)' }}>E-certificate & Pooja Video</h5>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Chat & How it Works */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2xl)', marginBottom: 'var(--space-3xl)' }}>
        
        {/* Ask Al Daadi */}
        <div style={{ background: '#F0F9F5', borderRadius: 'var(--radius-xl)', padding: 'var(--space-xl)', position: 'relative' }}>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--secondary)', marginBottom: '4px' }}>Al Daadi &ndash; Ask Anything</h3>
          <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: 'var(--space-lg)' }}>Your personal guide for festivals, rituals, stories and more.</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-sm)', marginBottom: 'var(--space-lg)' }}>
             <button style={{ background: 'white', border: '1px solid #C8E6C9', padding: '12px', borderRadius: 'var(--radius-md)', fontSize: '0.75rem', color: '#444', textAlign: 'left', display: 'flex', gap: '8px' }}><HelpCircle size={16} color="#4CAF50"/> Why do we celebrate Ganesh Chaturthi?</button>
             <button style={{ background: 'white', border: '1px solid #C8E6C9', padding: '12px', borderRadius: 'var(--radius-md)', fontSize: '0.75rem', color: '#444', textAlign: 'left', display: 'flex', gap: '8px' }}><HelpCircle size={16} color="#4CAF50"/> What items are needed for Varalakshmi Vratam?</button>
             <button style={{ background: 'white', border: '1px solid #C8E6C9', padding: '12px', borderRadius: 'var(--radius-md)', fontSize: '0.75rem', color: '#444', textAlign: 'left', display: 'flex', gap: '8px' }}><HelpCircle size={16} color="#4CAF50"/> How to do Satyanarayan Pooja at home?</button>
             <button style={{ background: 'white', border: '1px solid #C8E6C9', padding: '12px', borderRadius: 'var(--radius-md)', fontSize: '0.75rem', color: '#444', textAlign: 'left', display: 'flex', gap: '8px' }}><HelpCircle size={16} color="#4CAF50"/> Significance of Tulsi Vivah</button>
          </div>
          <button style={{ background: '#2E7D32', color: 'white', padding: '12px 24px', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem', fontWeight: 600 }}>Chat with Al Daadi &rarr;</button>
        </div>

        {/* How It Works */}
        <div style={{ background: '#FFFDF9', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-xl)' }}>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--secondary)', marginBottom: '4px' }}>How It Works</h3>
          <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: 'var(--space-xl)' }}>Simple steps to book your pooja</p>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
             <div style={{ position: 'absolute', top: '24px', left: '10%', right: '10%', borderTop: '2px dashed #E0E0E0', zIndex: 0 }}></div>
             
             <div style={{ zIndex: 1, textAlign: 'center', flex: 1 }}>
               <div style={{ width: '48px', height: '48px', background: 'white', border: '1px solid var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-sm)', color: 'var(--primary)' }}><Award size={24}/></div>
               <h4 style={{ fontSize: '0.75rem', color: 'var(--secondary)', fontWeight: 700 }}>Choose Service</h4>
               <p style={{ fontSize: '0.65rem', color: '#666' }}>Select the pooja you want to book</p>
             </div>
             <div style={{ zIndex: 1, textAlign: 'center', flex: 1 }}>
               <div style={{ width: '48px', height: '48px', background: 'white', border: '1px solid var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-sm)', color: 'var(--primary)' }}><Calendar size={24}/></div>
               <h4 style={{ fontSize: '0.75rem', color: 'var(--secondary)', fontWeight: 700 }}>Pick Date & Time</h4>
               <p style={{ fontSize: '0.65rem', color: '#666' }}>Choose your preferred slot</p>
             </div>
             <div style={{ zIndex: 1, textAlign: 'center', flex: 1 }}>
               <div style={{ width: '48px', height: '48px', background: 'white', border: '1px solid var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-sm)', color: 'var(--primary)' }}><CreditCard size={24}/></div>
               <h4 style={{ fontSize: '0.75rem', color: 'var(--secondary)', fontWeight: 700 }}>Make Payment</h4>
               <p style={{ fontSize: '0.65rem', color: '#666' }}>Secure payment via trusted gateway</p>
             </div>
             <div style={{ zIndex: 1, textAlign: 'center', flex: 1 }}>
               <div style={{ width: '48px', height: '48px', background: 'white', border: '1px solid var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-sm)', color: 'var(--primary)' }}><Video size={24}/></div>
               <h4 style={{ fontSize: '0.75rem', color: 'var(--secondary)', fontWeight: 700 }}>Pandit Connects</h4>
               <p style={{ fontSize: '0.65rem', color: '#666' }}>Join live pooja on time & receive blessings</p>
             </div>
          </div>
        </div>
      </div>

      {/* Footer Features */}
      <div style={{ background: '#FFF1E6', borderRadius: 'var(--radius-xl)', padding: 'var(--space-xl)', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-lg)' }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <ShieldCheck size={24} color="var(--secondary)" />
          <div>
            <h4 style={{ fontSize: '0.875rem', color: 'var(--secondary)' }}>100% Authentic</h4>
            <p style={{ fontSize: '0.7rem', color: '#666' }}>Rituals as per scriptures</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Users size={24} color="var(--secondary)" />
          <div>
            <h4 style={{ fontSize: '0.875rem', color: 'var(--secondary)' }}>Trusted by 50K+ Families</h4>
            <p style={{ fontSize: '0.7rem', color: '#666' }}>Across India</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Clock size={24} color="var(--secondary)" />
          <div>
            <h4 style={{ fontSize: '0.875rem', color: 'var(--secondary)' }}>On-time Pooja</h4>
            <p style={{ fontSize: '0.7rem', color: '#666' }}>Never miss an auspicious time</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Headphones size={24} color="var(--secondary)" />
          <div>
            <h4 style={{ fontSize: '0.875rem', color: 'var(--secondary)' }}>Customer Support</h4>
            <p style={{ fontSize: '0.7rem', color: '#666' }}>We&apos;re here to help you</p>
          </div>
        </div>
      </div>

    </div>
  );
}
