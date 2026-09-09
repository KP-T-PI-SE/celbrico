"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Plus, Check, Search } from "lucide-react";
import toast from "react-hot-toast";
import BottomNavigation from "@/components/BottomNavigation";
import { api } from "@/lib/api";
import { useCartStore, ProductItem } from "@/store/cartStore";

interface CategoryItem {
  _id: string;
  name: string;
  slug: string;
}

function CategoriesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeCat = searchParams.get("cat") || "all";
  const initialSearch = searchParams.get("search") || "";

  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [loading, setLoading] = useState(true);
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        setLoading(true);
        const catRes = await api.get("/categories");
        if (catRes.data.success) {
          setCategories(catRes.data.data);
        }

        const params: Record<string, string> = {};
        if (activeCat !== "all") {
          params.category = activeCat;
        }
        if (searchTerm) {
          params.search = searchTerm;
        }

        const prodRes = await api.get("/products", { params });
        if (prodRes.data.success) {
          setProducts(prodRes.data.data);
        }
      } catch (err) {
        console.error("Error fetching catalog", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCatalog();
  }, [activeCat, searchTerm]);

  const handleCategorySelect = (slug: string) => {
    if (slug === "all") {
      router.push("/categories");
    } else {
      router.push(`/categories?cat=${slug}`);
    }
  };

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
    <main className="min-h-screen bg-background pb-28">
      {/* Top Header */}
      <div className="sticky top-0 z-40 bg-card/90 backdrop-blur-md px-4 py-3 border-b border-orange-100/40">
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={() => router.push("/")}
            className="w-9 h-9 rounded-full bg-white border border-orange-100 flex items-center justify-center text-foreground/70 hover:text-primary transition-colors shadow-sm"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex-1">
            <h1 className="font-serif text-xl font-bold text-foreground">Festival Catalog</h1>
            <p className="text-[10px] text-foreground/60">Discover all sacred items & ingredients</p>
          </div>
        </div>

        {/* Search input in catalog */}
        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-foreground/40">
            <Search size={16} />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white py-2 pl-9 pr-4 rounded-full shadow-xs border border-orange-100/60 focus:outline-none focus:ring-2 focus:ring-primary/20 text-xs font-medium placeholder:text-foreground/40"
            placeholder="Search within festival catalog..."
          />
        </div>

        {/* Horizontal Category Pills */}
        <div className="flex gap-2 overflow-x-auto py-2.5 scrollbar-none mt-1">
          <button
            onClick={() => handleCategorySelect("all")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              activeCat === "all"
                ? "bg-primary text-white shadow-glow"
                : "bg-white text-foreground/70 border border-orange-100/70 hover:border-primary/40"
            }`}
          >
            All Items
          </button>

          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => handleCategorySelect(cat.slug)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeCat === cat.slug
                  ? "bg-primary text-white shadow-glow"
                  : "bg-white text-foreground/70 border border-orange-100/70 hover:border-primary/40"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-lg mx-auto px-4 mt-4">
        {loading ? (
          <div className="grid grid-cols-2 gap-3.5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-56 bg-white/60 rounded-3xl animate-pulse border border-orange-100/50" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <div className="text-4xl">🪔</div>
            <h3 className="font-serif text-lg font-bold text-foreground">No Products Found</h3>
            <p className="text-xs text-foreground/60 max-w-xs mx-auto">
              Try adjusting your category filter or search keywords.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                router.push("/categories");
              }}
              className="text-xs font-bold text-primary hover:underline"
            >
              Reset Filters
            </button>
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
      </div>

      <BottomNavigation />
    </main>
  );
}

export default function CategoriesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-sm text-foreground/50">Loading catalog...</div>}>
      <CategoriesContent />
    </Suspense>
  );
}
