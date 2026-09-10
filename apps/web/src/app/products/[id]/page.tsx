"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, ShoppingBag, ShieldCheck, Sparkles, Plus, Minus, Star, Truck } from "lucide-react";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import { useCartStore, ProductItem } from "@/store/cartStore";

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [product, setProduct] = useState<ProductItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/products/${resolvedParams.id}`);
        if (res.data.success) {
          setProduct(res.data.data);
        }
      } catch (err) {
        console.error("Failed fetching product", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <div className="text-4xl animate-bounce mb-3">🪔</div>
        <p className="text-xs text-foreground/60">Fetching sacred product details...</p>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="text-4xl">🪔</div>
        <h2 className="font-serif text-xl font-bold text-foreground">Product Not Found</h2>
        <p className="text-xs text-foreground/60 max-w-xs">
          The festival item you are looking for may have concluded its batch or moved.
        </p>
        <button
          onClick={() => router.push("/categories")}
          className="px-5 py-2.5 bg-primary text-white text-xs font-bold rounded-full shadow-glow"
        >
          Explore Other Items
        </button>
      </main>
    );
  }

  const effectivePrice = product.discountPrice && product.discountPrice > 0
    ? product.discountPrice
    : product.price;

  const isOutOfStock = !product.isActive || product.stock <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) {
      toast.error("This item is currently out of stock");
      return;
    }
    const added = addItem(product, quantity);
    if (added) {
      toast.success(`Added ${quantity} × ${product.name} to cart!`);
    } else {
      toast.error(`Cannot add more than available stock (${product.stock})`);
    }
  };

  const handleBuyNow = () => {
    if (isOutOfStock) {
      toast.error("This item is currently out of stock");
      return;
    }
    const added = addItem(product, quantity);
    if (added) {
      router.push("/checkout");
    }
  };

  const categoryName = product.category && typeof product.category === 'object' && 'name' in product.category
    ? (product.category as { name: string }).name
    : "Festival Item";

  return (
    <main className="min-h-screen bg-background pb-28">
      {/* Top Navigation */}
      <div className="sticky top-0 z-40 bg-card/85 backdrop-blur-md px-4 py-3 border-b border-orange-100/40 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-full bg-white border border-orange-100 flex items-center justify-center text-foreground/70 hover:text-primary transition-colors shadow-sm"
        >
          <ArrowLeft size={18} />
        </button>
        <span className="text-xs font-serif font-bold text-primary">Celbrico Essentials</span>
        <button
          onClick={() => router.push("/cart")}
          className="w-9 h-9 rounded-full bg-white border border-orange-100 flex items-center justify-center text-foreground/70 hover:text-primary transition-colors shadow-sm"
        >
          <ShoppingBag size={18} />
        </button>
      </div>

      <div className="max-w-md mx-auto px-4 mt-3 space-y-5">
        {/* Main Product Image Carousel / Box */}
        <div className="w-full aspect-square bg-white rounded-3xl p-4 border border-orange-100/70 shadow-glass relative overflow-hidden flex items-center justify-center">
          {product.images && product.images.length > 0 ? (
            <Image
              src={product.images[activeImageIndex] || product.images[0]}
              alt={product.name}
              fill
              className="object-contain p-4"
              priority
            />
          ) : (
            <div className="text-6xl">🪔</div>
          )}

          {product.discountPrice && (
            <span className="absolute top-4 left-4 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-xs">
              {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% SAVINGS
            </span>
          )}

          {product.stock > 0 ? (
            <span className="absolute top-4 right-4 bg-green-100 text-green-700 text-[10px] font-bold px-2.5 py-1 rounded-full border border-green-200">
              In Stock ({product.stock})
            </span>
          ) : (
            <span className="absolute top-4 right-4 bg-red-100 text-red-600 text-[10px] font-bold px-2.5 py-1 rounded-full">
              Out of Stock
            </span>
          )}
        </div>

        {/* Thumbnail Selector if multiple images */}
        {product.images && product.images.length > 1 && (
          <div className="flex gap-2 justify-center">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`relative w-14 h-14 rounded-xl overflow-hidden border-2 transition-all ${
                  activeImageIndex === idx ? "border-primary scale-105" : "border-orange-100 opacity-60"
                }`}
              >
                <Image src={img} alt="" fill className="object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Product Title & Pricing */}
        <div className="bg-white rounded-3xl p-5 border border-orange-100/60 shadow-glass space-y-3">
          <span className="text-[10px] uppercase font-bold tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-full">
            {categoryName}
          </span>

          <h1 className="font-serif text-xl font-bold text-foreground leading-snug">
            {product.name}
          </h1>

          <div className="flex items-baseline gap-3 pt-1">
            <span className="text-2xl font-bold text-primary font-serif">₹{effectivePrice}</span>
            {product.discountPrice && (
              <span className="text-sm text-foreground/40 line-through">₹{product.price}</span>
            )}
            <span className="text-[10px] text-green-700 font-bold bg-green-50 px-2 py-0.5 rounded">
              Taxes Included
            </span>
          </div>

          <div className="flex items-center gap-4 pt-2 border-t border-orange-50 text-xs text-foreground/70">
            <div className="flex items-center gap-1 text-amber-500 font-bold">
              <Star size={14} className="fill-current" /> 4.9 (120+ reviews)
            </div>
            <div className="flex items-center gap-1 text-green-600 font-semibold">
              <Truck size={14} /> Fast Dispatch
            </div>
          </div>
        </div>

        {/* Product Description */}
        <div className="bg-white rounded-3xl p-5 border border-orange-100/60 shadow-glass space-y-2.5">
          <h3 className="font-serif text-sm font-bold text-foreground">Sacred Description & Details</h3>
          <p className="text-xs text-foreground/75 leading-relaxed font-medium">
            {product.description || "Authentic festive item prepared and verified with strict adherence to temple traditions."}
          </p>

          <div className="grid grid-cols-2 gap-2.5 pt-3">
            <div className="p-2.5 rounded-2xl bg-orange-50/50 border border-orange-100/50 flex items-center gap-2">
              <ShieldCheck size={16} className="text-primary shrink-0" />
              <span className="text-[11px] font-medium text-foreground/80">100% Authentic</span>
            </div>
            <div className="p-2.5 rounded-2xl bg-orange-50/50 border border-orange-100/50 flex items-center gap-2">
              <Sparkles size={16} className="text-gold shrink-0" />
              <span className="text-[11px] font-medium text-foreground/80">Purity Guaranteed</span>
            </div>
          </div>
        </div>

        {/* Quantity Selection */}
        <div className="bg-white rounded-3xl p-4 border border-orange-100/60 shadow-glass flex items-center justify-between">
          <span className="text-xs font-bold text-foreground">Quantity</span>
          <div className="flex items-center border border-orange-200 rounded-full bg-orange-50/30 overflow-hidden">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-1.5 px-3 text-foreground/70 hover:text-primary transition-colors"
            >
              <Minus size={14} />
            </button>
            <span className="text-xs font-bold px-3 text-foreground">{quantity}</span>
            <button
              onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
              className="p-1.5 px-3 text-foreground/70 hover:text-primary transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Floating Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-orange-100/70 p-4 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="flex-1 py-3.5 px-4 bg-orange-50 hover:bg-orange-100/80 border border-orange-200 text-primary font-bold text-xs rounded-2xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingBag size={16} /> {isOutOfStock ? "Out of Stock" : "Add to Cart"}
          </button>
          <button
            onClick={handleBuyNow}
            disabled={isOutOfStock}
            className="flex-1 py-3.5 px-4 bg-linear-to-r from-primary to-primary-dark text-white font-bold text-xs rounded-2xl shadow-glow hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isOutOfStock ? "Unavailable" : `Buy Now (₹${effectivePrice * quantity})`}
          </button>
        </div>
      </div>
    </main>
  );
}
