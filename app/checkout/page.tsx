'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, MapPin, Clock, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AnimatedButton } from '@/components/ui/AnimatedButton';

export default function CheckoutPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedSlot, setSelectedSlot] = useState('Instant (10 Mins)');
  const [selectedPayment, setSelectedPayment] = useState('UPI');

  const slots = ['Instant (10 Mins)', 'Today, 2 PM - 4 PM', 'Tomorrow, 10 AM - 12 PM'];
  const payments = [
    { id: 'UPI', name: 'UPI (GPay, PhonePe)', icon: '📱' },
    { id: 'CARD', name: 'Credit / Debit Card', icon: '💳' },
    { id: 'COD', name: 'Cash on Delivery', icon: '💵' }
  ];

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else {
      // Simulate Order Success
      router.push('/order-success');
    }
  };

  return (
    <div className="w-full min-h-screen bg-neutral-50 dark:bg-neutral-900 pb-32">
      
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-border/50 pt-safe px-4 py-3 flex items-center gap-3">
        <button onClick={() => {
           if (step > 1) setStep(step - 1);
           else router.back();
        }} className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="font-bold text-lg leading-tight">Checkout</h1>
      </div>

      {/* Stepper */}
      <div className="bg-white dark:bg-neutral-800 p-4 border-b border-border shadow-sm flex items-center justify-center gap-2">
         {[1, 2, 3].map(i => (
           <React.Fragment key={i}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                 step >= i ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
              }`}>
                 {step > i ? <CheckCircle2 size={16} /> : i}
              </div>
              {i < 3 && <div className={`w-10 h-1 rounded-full ${step > i ? 'bg-primary' : 'bg-muted'}`} />}
           </React.Fragment>
         ))}
      </div>

      <div className="p-4 space-y-6 mt-2">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: Address */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
               <h2 className="text-xl font-bold mb-4">Select Address</h2>
               
               {/* Address Card */}
               <div className="bg-orange-50 border-2 border-primary rounded-2xl p-4 relative">
                  <div className="absolute top-4 right-4 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded">DEFAULT</div>
                  <div className="flex gap-3">
                     <MapPin className="text-primary mt-0.5" size={20} />
                     <div>
                        <h3 className="font-bold">Home</h3>
                        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                           123, Luxury Apartments, Road No 36, Jubilee Hills, Hyderabad, Telangana 500033
                        </p>
                        <p className="text-sm font-semibold mt-2">Ph: +91 98765 43210</p>
                     </div>
                  </div>
               </div>
               
               <button className="w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed border-border rounded-2xl text-primary font-semibold hover:bg-muted/50 transition-colors">
                  <MapPin size={18} /> Add New Address
               </button>
            </motion.div>
          )}

          {/* STEP 2: Delivery Slot */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
               <h2 className="text-xl font-bold mb-4">Delivery Slot</h2>
               
               <div className="space-y-3">
                 {slots.map(slot => (
                   <div 
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={`rounded-2xl p-4 flex items-center gap-3 cursor-pointer transition-all ${
                         selectedSlot === slot 
                           ? 'bg-orange-50 border-2 border-primary' 
                           : 'bg-white border border-border'
                      }`}
                   >
                      <Clock className={selectedSlot === slot ? 'text-primary' : 'text-muted-foreground'} size={20} />
                      <span className={`font-semibold ${selectedSlot === slot ? 'text-primary' : 'text-foreground'}`}>{slot}</span>
                      {selectedSlot === slot && <div className="ml-auto w-4 h-4 rounded-full border-4 border-primary" />}
                   </div>
                 ))}
               </div>
               
               {/* Gift Message */}
               <div className="bg-white rounded-2xl p-4 border border-border mt-6">
                  <h3 className="font-bold text-sm mb-2">🎁 Add a Gift Message</h3>
                  <textarea 
                     placeholder="Write your wishes here..." 
                     className="w-full bg-muted border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary outline-none resize-none h-20"
                  />
               </div>
            </motion.div>
          )}

          {/* STEP 3: Payment */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
               <h2 className="text-xl font-bold mb-4">Payment Options</h2>
               
               <div className="space-y-3">
                 {payments.map(payment => (
                   <div 
                      key={payment.id}
                      onClick={() => setSelectedPayment(payment.id)}
                      className={`rounded-2xl p-4 flex items-center gap-3 cursor-pointer transition-all ${
                         selectedPayment === payment.id 
                           ? 'bg-orange-50 border-2 border-primary' 
                           : 'bg-white border border-border'
                      }`}
                   >
                      <span className="text-2xl">{payment.icon}</span>
                      <span className={`font-semibold flex-1 ${selectedPayment === payment.id ? 'text-primary' : 'text-foreground'}`}>{payment.name}</span>
                      {selectedPayment === payment.id && <div className="w-4 h-4 rounded-full border-4 border-primary" />}
                   </div>
                 ))}
               </div>

               <div className="flex items-center gap-2 justify-center mt-6 p-4 text-xs text-muted-foreground font-medium">
                 <ShieldCheck size={16} className="text-green-600" />
                 100% Secure Payments
               </div>
            </motion.div>
          )}
          
        </AnimatePresence>
      </div>

      {/* Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-border/50 p-4 pb-safe max-w-md mx-auto z-40">
         <AnimatedButton 
            className="w-full flex items-center justify-between px-6" 
            size="lg"
            onClick={handleNext}
         >
            <div className="flex flex-col items-start">
               <span className="text-[10px] font-medium opacity-80">TOTAL</span>
               <span className="font-bold text-lg">₹1,998</span>
            </div>
            <div className="flex items-center font-bold text-lg">
               {step === 3 ? 'Pay Securely' : 'Proceed'}
            </div>
         </AnimatedButton>
      </div>
      
    </div>
  );
}
