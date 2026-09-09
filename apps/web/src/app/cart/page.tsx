"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useIsMounted } from "@/lib/useIsMounted";
import BottomNavigation from "@/components/BottomNavigation";

export default function CartPage() {
  const router = useRouter();
  const mounted = useIsMounted();
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    getSubtotal,
    getDeliveryFee,
    getTotalAmount,
  } = useCartStore();

  if (!mounted) {
    return (
      <main className="min-h-screen bg-background pb-24 pt-8 px-4 flex items-center justify-center">
        <div className="animate-pulse text-sm text-foreground/50">Loading your sacred cart...</div>
      </main>
    );
  }

  const subtotal = getSubtotal();
  const deliveryFee = getDeliveryFee();
  const totalAmount = getTotalAmount();
  const freeDeliveryThreshold = 499;
  const amountToFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);

  return (
    <main className="min-h-screen bg-background pb-28">
      {/* Top Header */}
      <div className="sticky top-0 z-40 bg-card/90 backdrop-blur-md px-4 py-4 border-b border-orange-100/40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 rounded-full bg-white border border-orange-100 flex items-center justify-center text-foreground/70 hover:text-primary transition-colors shadow-sm"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="font-serif text-xl font-bold text-foreground">Festive Cart</h1>
            <p className="text-[10px] text-foreground/60">{items.length} unique item{items.length === 1 ? '' : 's'}</p>
          </div>
        </div>
        {items.length > 0 && (
          <button
            onClick={clearCart}
            className="text-xs text-red-500 hover:underline flex items-center gap-1 font-medium"
          >
            <Trash2 size={13} /> Clear
          </button>
        )}
      </div>

      <div className="max-w-md mx-auto px-4 mt-4 space-y-5">
        {items.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-24 h-24 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center text-4xl shadow-inner">
              🪔
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold text-foreground">Your Cart is Empty</h2>
              <p className="text-xs text-foreground/60 mt-1 max-w-xs">
                Explore handpicked pooja kits, pure samagri, and festival essentials for your home.
              </p>
            </div>
            <Link
              href="/categories"
              className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-primary to-primary-light text-white font-medium text-sm rounded-full shadow-glow hover:scale-105 transition-transform"
            >
              <ShoppingBag size={16} /> Explore Festival Essentials
            </Link>
          </div>
        ) : (
          <>
            {/* Free Delivery Banner */}
            <div className="bg-linear-to-r from-orange-500/10 to-gold/10 p-3.5 rounded-2xl border border-orange-200/50">
              {amountToFreeDelivery > 0 ? (
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-foreground/80">
                    <span>Add ₹{amountToFreeDelivery} more for FREE delivery</span>
                    <span>₹{subtotal} / ₹{freeDeliveryThreshold}</span>
                  </div>
                  <div className="w-full h-1.5 bg-white rounded-full overflow-hidden">
                    <div
                      className="h-full bg-linear-to-r from-primary to-gold rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (subtotal / freeDeliveryThreshold) * 100)}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs font-bold text-green-700">
                  <Sparkles size={16} className="text-green-600" />
                  <span>Congratulations! You have unlocked FREE Express Delivery!</span>
                </div>
              )}
            </div>

            {/* Cart Items List */}
            <div className="space-y-3">
              {items.map(({ product, quantity }) => {
                const effectivePrice = product.discountPrice && product.discountPrice > 0
                  ? product.discountPrice
                  : product.price;

                return (
                  <div
                    key={product._id}
                    className="bg-white rounded-2xl p-3.5 border border-orange-100/60 shadow-sm flex items-center gap-3.5"
                  >
                    {/* Image */}
                    <div className="w-20 h-20 rounded-xl bg-orange-50/40 relative overflow-hidden shrink-0 border border-orange-50">
                      {product.images && product.images.length > 0 ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">🪔</div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs font-bold text-foreground truncate">{product.name}</h3>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-sm font-bold text-primary">₹{effectivePrice}</span>
                        {product.discountPrice && (
                          <span className="text-[10px] text-foreground/40 line-through">₹{product.price}</span>
                        )}
                      </div>

                      {/* Controls */}
                      <div className="flex items-center justify-between mt-2.5">
                        <div className="flex items-center border border-orange-200 rounded-full bg-orange-50/30 overflow-hidden">
                          <button
                            onClick={() => updateQuantity(product._id, quantity - 1)}
                            className="p-1 px-2 text-foreground/70 hover:text-primary transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-xs font-bold px-2 text-foreground">{quantity}</span>
                          <button
                            onClick={() => updateQuantity(product._id, quantity + 1)}
                            className="p-1 px-2 text-foreground/70 hover:text-primary transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(product._id)}
                          className="text-foreground/40 hover:text-red-500 p-1 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bill Summary */}
            <div className="bg-white rounded-3xl p-5 border border-orange-100/60 shadow-sm space-y-3">
              <h3 className="font-serif text-sm font-bold text-foreground">Order Summary</h3>
              <div className="space-y-2 text-xs divide-y divide-orange-50">
                <div className="flex justify-between pt-1 text-foreground/70">
                  <span>Item Subtotal</span>
                  <span className="font-medium text-foreground">₹{subtotal}</span>
                </div>
                <div className="flex justify-between pt-2 text-foreground/70">
                  <span>Delivery Charges</span>
                  <span className={`font-medium ${deliveryFee === 0 ? 'text-green-600 font-bold' : 'text-foreground'}`}>
                    {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                  </span>
                </div>
                <div className="flex justify-between pt-2 text-sm font-bold text-foreground">
                  <span>Total Amount</span>
                  <span className="text-primary text-base">₹{totalAmount}</span>
                </div>
              </div>
            </div>

            {/* Trust Assurance */}
            <div className="flex items-center gap-2 text-[11px] text-foreground/70 bg-white/70 p-3 rounded-2xl border border-orange-100/40">
              <ShieldCheck size={18} className="text-primary shrink-0" />
              <span>100% Authentic temple-grade ingredients with safe doorstep delivery.</span>
            </div>

            {/* Checkout Action */}
            <button
              onClick={() => router.push("/checkout")}
              className="w-full bg-linear-to-r from-primary to-primary-dark text-white font-semibold rounded-2xl py-4 shadow-glow flex items-center justify-center gap-2 hover:scale-[1.01] transition-transform text-sm"
            >
              Proceed to Checkout (₹{totalAmount}) <ArrowRight size={18} />
            </button>
          </>
        )}
      </div>

      <BottomNavigation />
    </main>
  );
}
