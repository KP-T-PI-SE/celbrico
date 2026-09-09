"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Plus, Sparkles, Star, ShieldCheck, Check } from "lucide-react";
import toast from "react-hot-toast";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import { api } from "@/lib/api";
import { useCartStore, ProductItem } from "@/store/cartStore";

interface CategoryItem {
  _id: string;
  name: string;
  slug: string;
  image?: string;
}

export default function Home() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [catRes, prodRes] = await Promise.allSettled([
          api.get("/categories"),
          api.get("/products"),
        ]);

        if (catRes.status === "fulfilled" && catRes.value.data.success) {
          setCategories(catRes.value.data.data);
        } else {
          // Fallback categories if backend just starting
          setCategories([
            { _id: '1', name: 'Pooja Kits', slug: 'pooja-kits', image: '/assets/categories/cat-pooja-kits.png' },
            { _id: '2', name: 'Hawan Samagri', slug: 'samagri', image: '/assets/categories/cat-samagri.png' },
            { _id: '3', name: 'Festive Groceries', slug: 'groceries', image: '/assets/categories/cat-groceries.png' },
            { _id: '4', name: 'Fresh Flowers', slug: 'flowers', image: '/assets/categories/cat-flowers.png' },
            { _id: '5', name: 'Fruits & Dry Fruits', slug: 'fruits', image: '/assets/categories/cat-fruits.png' },
          ]);
        }

        if (prodRes.status === "fulfilled" && prodRes.value.data.success) {
          setProducts(prodRes.value.data.data);
        }
      } catch (err) {
        console.error("Failed loading storefront data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddToCart = (e: React.MouseEvent, product: ProductItem) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    toast.success(`Added ${product.name} to cart!`);

    setAddedIds((prev) => ({ ...prev, [product._id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product._id]: false }));
    }, 1500);
  };

  return (
    <main className="flex-1 pb-28 relative overflow-hidden min-h-screen bg-background">
      {/* Decorative background glow elements */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-80 left-0 -ml-20 w-60 h-60 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

      <Header />

      <div className="px-4 mt-5 space-y-7 max-w-lg mx-auto">
        {/* Festive Offer Banner */}
        <section className="relative overflow-hidden rounded-3xl bg-linear-to-r from-orange-100 via-amber-50 to-orange-50 p-6 shadow-glass border border-orange-200/60">
          <div className="relative z-10 w-3/5">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 mb-2.5 text-[10px] font-bold tracking-wider text-white uppercase bg-primary rounded-full shadow-xs">
              <Sparkles size={11} /> Festive Special
            </span>
            <h2 className="font-serif text-2xl font-bold text-foreground mb-2 leading-tight">
              Pure Pooja Kits, Delivered.
            </h2>
            <p className="text-xs text-foreground/75 mb-4 leading-relaxed font-medium">
              Handpicked temple-grade samagri for every celebration.
            </p>
            <Link
              href="/categories"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white transition-transform rounded-full bg-linear-to-r from-primary to-primary-dark shadow-glow hover:scale-105"
            >
              Shop All <ChevronRight size={15} />
            </Link>
          </div>

          <div className="absolute right-0 bottom-0 w-2/5 h-full pointer-events-none flex items-end justify-end">
            <div className="relative w-36 h-36 -mr-2 -mb-2">
              <Image
                src="/assets/hero-festive-hamper.png"
                alt="Festive Pooja Hamper"
                fill
                className="object-contain drop-shadow-md"
                priority
              />
            </div>
          </div>
        </section>

        {/* Shop by Category */}
        <section>
          <div className="flex items-center justify-between mb-3.5 px-1">
            <div>
              <h3 className="font-serif text-lg font-bold text-foreground">Shop by Category</h3>
              <p className="text-[10px] text-foreground/60">Curated authentic festive essentials</p>
            </div>
            <Link
              href="/categories"
              className="flex items-center text-xs font-semibold text-primary hover:underline"
            >
              View All <ChevronRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {categories.slice(0, 4).map((cat) => (
              <Link
                key={cat._id}
                href={`/categories?cat=${cat.slug}`}
                className="flex flex-col items-center gap-2 group text-center"
              >
                <div className="w-full aspect-square rounded-2xl bg-white shadow-glass border border-orange-100/70 p-2 flex items-center justify-center group-hover:scale-105 group-hover:border-primary/40 transition-all relative overflow-hidden">
                  {cat.image ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={cat.image}
                        alt={cat.name}
                        fill
                        className="object-contain p-1"
                      />
                    </div>
                  ) : (
                    <span className="text-2xl">🪔</span>
                  )}
                </div>
                <span className="text-[11px] font-bold text-foreground/80 line-clamp-1 leading-tight group-hover:text-primary transition-colors">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Products Collection */}
        <section>
          <div className="flex items-center justify-between mb-3.5 px-1">
            <div>
              <h3 className="font-serif text-lg font-bold text-foreground">Festival Must-Haves</h3>
              <p className="text-[10px] text-foreground/60">Top ordered kits & divine essentials</p>
            </div>
            <Link
              href="/categories"
              className="flex items-center text-xs font-semibold text-primary hover:underline"
            >
              See More <ChevronRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 gap-3.5">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-56 bg-white/60 rounded-3xl animate-pulse border border-orange-100/50" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3.5">
              {products.map((product) => {
                const effectivePrice = product.discountPrice && product.discountPrice > 0
                  ? product.discountPrice
                  : product.price;
                const isAdded = addedIds[product._id];

                return (
                  <div
                    key={product._id}
                    className="bg-white rounded-3xl p-3 border border-orange-100/60 shadow-glass flex flex-col justify-between group hover:shadow-md hover:border-orange-200 transition-all"
                  >
                    <Link href={`/products/${product.slug}`} className="block">
                      <div className="w-full aspect-square rounded-2xl bg-orange-50/40 relative overflow-hidden mb-2.5 border border-orange-50/80">
                        {product.images && product.images.length > 0 ? (
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-3xl">🪔</div>
                        )}
                        {product.discountPrice && (
                          <span className="absolute top-2 left-2 bg-primary text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                            {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                          </span>
                        )}
                      </div>

                      <h4 className="text-xs font-bold text-foreground line-clamp-2 leading-tight min-h-8">
                        {product.name}
                      </h4>
                    </Link>

                    <div className="mt-3 flex items-center justify-between pt-2 border-t border-orange-50">
                      <div>
                        <div className="text-sm font-bold text-primary leading-none">₹{effectivePrice}</div>
                        {product.discountPrice && (
                          <span className="text-[10px] text-foreground/40 line-through">₹{product.price}</span>
                        )}
                      </div>

                      <button
                        onClick={(e) => handleAddToCart(e, product)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                          isAdded
                            ? 'bg-green-600 text-white'
                            : 'bg-primary text-white hover:scale-110 shadow-glow'
                        }`}
                        aria-label={`Add ${product.name} to cart`}
                      >
                        {isAdded ? <Check size={16} /> : <Plus size={16} />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Trust Badges */}
        <section className="bg-white rounded-3xl p-5 border border-orange-100/60 shadow-glass divide-y divide-orange-50">
          <div className="flex items-center gap-3.5 pb-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-foreground">100% Pure & Vedic Certified</h4>
              <p className="text-[10px] text-foreground/60">Strictly natural, chemical-free pooja essentials.</p>
            </div>
          </div>
          <div className="flex items-center gap-3.5 pt-3">
            <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center text-amber-600 shrink-0">
              <Star size={18} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-foreground">On-Time Festival Guarantee</h4>
              <p className="text-[10px] text-foreground/60">Express doorstep dispatch before auspicious muhurats.</p>
            </div>
          </div>
        </section>
      </div>

      <BottomNavigation />
    </main>
  );
}
