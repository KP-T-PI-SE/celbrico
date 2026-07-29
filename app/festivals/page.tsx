import React from 'react';
import Link from 'next/link';
import { Calendar as CalendarIcon, Clock, Package, ShieldCheck, Truck, Percent, Headset, ChevronRight } from 'lucide-react';

export default function FestivalsPage() {
  const festivals = [
    { name: 'Ganesh Chaturthi', date: '7 - 17 Sep 2024', tag: 'Upcoming', img: 'ganesh' },
    { name: 'Diwali', date: '31 Oct 2024', tag: 'Popular', img: 'diwali' },
    { name: 'Dussehra', date: '12 Oct 2024', tag: null, img: 'dussehra' },
    { name: 'Navratri', date: '3 - 11 Oct 2024', tag: null, img: 'navratri' },
    { name: 'Ugadi', date: '9 Apr 2024', tag: null, img: 'ugadi' },
    { name: 'Sankranti', date: '14 Jan 2025', tag: null, img: 'sankranti' },
    { name: 'Holi', date: '25 Mar 2024', tag: null, img: 'holi' },
    { name: 'Eid', date: '11 Apr 2024', tag: null, img: 'eid' },
    { name: 'Christmas', date: '25 Dec 2024', tag: null, img: 'christmas' },
    { name: 'Raksha Bandhan', date: '19 Aug 2024', tag: null, img: 'raksha' },
    { name: 'Janmashtami', date: '26 Aug 2024', tag: null, img: 'janmashtami' },
    { name: 'Onam', date: '15 Sep 2024', tag: null, img: 'onam' },
  ];

  return (
    <div className="container" style={{ padding: 'var(--space-md) var(--space-xl)', paddingBottom: 'var(--space-4xl)' }}>
      {/* Breadcrumb */}
      <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: 'var(--space-md)' }}>
        <Link href="/">Home</Link> &gt; <span>Festivals</span>
      </div>

      {/* Top Section */}
      <div style={{ display: 'flex', gap: 'var(--space-2xl)', marginBottom: 'var(--space-xl)', flexWrap: 'wrap' }}>
        
        {/* Title Area */}
        <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h1 style={{ fontSize: '3rem', color: 'var(--secondary)', marginBottom: 'var(--space-sm)' }}>Festivals</h1>
          <p style={{ fontSize: '1rem', color: '#666', maxWidth: '350px' }}>Choose your festival. We&apos;ll help you get everything you need for a perfect celebration.</p>
        </div>

        {/* Featured Upcoming Festival */}
        <div style={{ flex: 2, minWidth: '500px', background: '#FFF1E6', borderRadius: 'var(--radius-xl)', overflow: 'hidden', display: 'flex', position: 'relative' }}>
          <div style={{ flex: 1, padding: 'var(--space-xl)', zIndex: 10, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600, marginBottom: '4px' }}>Upcoming Festival</span>
            <h2 style={{ fontSize: '2rem', color: 'var(--secondary)', marginBottom: 'var(--space-md)' }}>Ganesh Chaturthi</h2>
            <div style={{ display: 'flex', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)', alignItems: 'center' }}>
               <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--secondary)' }}>18 <span style={{ fontSize: '0.75rem', fontWeight: 'normal' }}>Days</span></div>
               <span style={{ color: '#ccc' }}>:</span>
               <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--secondary)' }}>07 <span style={{ fontSize: '0.75rem', fontWeight: 'normal' }}>Hours</span></div>
               <span style={{ color: '#ccc' }}>:</span>
               <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--secondary)' }}>42 <span style={{ fontSize: '0.75rem', fontWeight: 'normal' }}>Minutes</span></div>
            </div>
            <button style={{ background: 'var(--primary)', color: 'white', padding: '8px 16px', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem', width: 'fit-content' }}>Shop Essentials &rarr;</button>
          </div>
          <div style={{ flex: 1, background: '#D32F2F', position: 'relative' }}>
             {/* Placeholder for Ganesha Image */}
             <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, #FFF1E6, transparent)' }}></div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-xl)', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
        <div style={{ display: 'flex', gap: 'var(--space-sm)', background: 'white', padding: '4px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
           <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: '#FFF1E6', color: 'var(--primary)', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem', fontWeight: 600 }}><CalendarIcon size={16}/> All Festivals</button>
           <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: 'transparent', color: '#666', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem', fontWeight: 500 }}><Clock size={16}/> Upcoming</button>
           <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: 'transparent', color: '#666', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem', fontWeight: 500 }}><CalendarIcon size={16}/> This Month</button>
           <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: 'transparent', color: '#666', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem', fontWeight: 500 }}><span style={{fontSize: '1.2rem', lineHeight: 0.5}}>∞</span> All Time</button>
        </div>

        <div style={{ background: '#FFF7ED', border: '1px dashed var(--primary)', borderRadius: 'var(--radius-md)', padding: 'var(--space-sm) var(--space-lg)', display: 'flex', alignItems: 'center', gap: 'var(--space-lg)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem', fontWeight: 700, color: 'var(--secondary)' }}><CalendarIcon size={16} color="var(--primary)" /> Plan Ahead & Save More</div>
            <div style={{ fontSize: '0.75rem', color: '#666' }}>Shop early and get everything delivered before the rush.</div>
          </div>
          <button style={{ border: '1px solid var(--primary)', color: 'var(--primary)', background: 'white', padding: '4px 12px', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', fontWeight: 600 }}>View Calendar</button>
        </div>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--space-lg)', marginBottom: 'var(--space-3xl)' }}>
        {festivals.map(fest => (
          <Link href={`/festival/${fest.img}`} key={fest.name} style={{ background: 'white', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border)', position: 'relative', display: 'flex', flexDirection: 'column' }}>
            {fest.tag && <div style={{ position: 'absolute', top: '12px', right: '12px', background: fest.tag === 'Upcoming' ? '#4CAF50' : '#E65100', color: 'white', fontSize: '0.6rem', padding: '2px 8px', borderRadius: 'var(--radius-sm)', zIndex: 10, fontWeight: 700, textTransform: 'uppercase' }}>{fest.tag}</div>}
            <div style={{ width: '100%', height: '140px', background: '#3A1F1F' }}>
              {/* Image Placeholder */}
            </div>
            <div style={{ padding: 'var(--space-md)', textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
               <h3 style={{ fontSize: '1rem', color: 'var(--secondary)', marginBottom: '4px' }}>{fest.name}</h3>
               <p style={{ fontSize: '0.75rem', color: '#666', marginBottom: 'var(--space-md)' }}>{fest.date}</p>
               <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.875rem', color: 'var(--primary)', fontWeight: 600 }}>Shop Now <ChevronRight size={16}/></div>
            </div>
          </Link>
        ))}
      </div>

      {/* Footer Features */}
      <div style={{ background: '#FFF1E6', borderRadius: 'var(--radius-xl)', padding: 'var(--space-xl)', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 'var(--space-lg)' }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Package size={24} color="var(--secondary)" />
          <div>
            <h4 style={{ fontSize: '0.875rem', color: 'var(--secondary)' }}>Everything in One Place</h4>
            <p style={{ fontSize: '0.7rem', color: '#666' }}>Pooja items, groceries, sweets, decorations & more.</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <ShieldCheck size={24} color="var(--secondary)" />
          <div>
            <h4 style={{ fontSize: '0.875rem', color: 'var(--secondary)' }}>Authentic & Trusted</h4>
            <p style={{ fontSize: '0.7rem', color: '#666' }}>Carefully sourced, 100% authentic products for every festival.</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Truck size={24} color="var(--secondary)" />
          <div>
            <h4 style={{ fontSize: '0.875rem', color: 'var(--secondary)' }}>On-time Delivery</h4>
            <p style={{ fontSize: '0.7rem', color: '#666' }}>Schedule your delivery and celebrate without worries.</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Percent size={24} color="var(--secondary)" />
          <div>
            <h4 style={{ fontSize: '0.875rem', color: 'var(--secondary)' }}>Best Prices & Offers</h4>
            <p style={{ fontSize: '0.7rem', color: '#666' }}>Exclusive deals & early bird discounts on all festivals.</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Headset size={24} color="var(--secondary)" />
          <div>
            <h4 style={{ fontSize: '0.875rem', color: 'var(--secondary)' }}>Festive Support</h4>
            <p style={{ fontSize: '0.7rem', color: '#666' }}>Need help? Our team is always here for you.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
