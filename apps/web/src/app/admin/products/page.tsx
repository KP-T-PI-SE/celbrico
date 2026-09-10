"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  RefreshCw,
  EyeOff,
} from "lucide-react";
import toast from "react-hot-toast";
import { api } from "@/lib/api";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface Product {
  _id: string;
  name: string;
  slug: string;
  category: {
    _id: string;
    name: string;
  } | string;
  price: number;
  discountPrice?: number;
  stock: number;
  images: string[];
  description?: string;
  isActive: boolean;
  createdAt: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  // Product Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form Fields
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [stock, setStock] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);

  const loadCatalog = () => {
    setLoading(true);
    Promise.all([
      api.get("/admin/products", {
        params: {
          search: searchTerm || undefined,
          active: activeFilter !== "all" ? activeFilter : undefined,
        },
      }),
      api.get("/categories"),
    ])
      .then(([prodRes, catRes]) => {
        if (prodRes.data.success) {
          setProducts(prodRes.data.data);
        }
        if (catRes.data.success) {
          setCategories(catRes.data.data);
        }
      })
      .catch((err: unknown) => {
        const error = err as { response?: { data?: { message?: string } } };
        toast.error(error.response?.data?.message || "Failed to load catalog");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    let isSubscribed = true;
    Promise.all([
      api.get("/admin/products", {
        params: {
          search: searchTerm || undefined,
          active: activeFilter !== "all" ? activeFilter : undefined,
        },
      }),
      api.get("/categories"),
    ])
      .then(([prodRes, catRes]) => {
        if (isSubscribed) {
          if (prodRes.data.success) {
            setProducts(prodRes.data.data);
          }
          if (catRes.data.success) {
            setCategories(catRes.data.data);
          }
        }
      })
      .catch((err: unknown) => {
        if (isSubscribed) {
          const error = err as { response?: { data?: { message?: string } } };
          toast.error(error.response?.data?.message || "Failed to load catalog");
        }
      })
      .finally(() => {
        if (isSubscribed) {
          setLoading(false);
        }
      });

    return () => {
      isSubscribed = false;
    };
  }, [searchTerm, activeFilter]);

  const openCreateModal = () => {
    setEditingProduct(null);
    setName("");
    setCategoryId(categories.length > 0 ? categories[0]._id : "");
    setPrice("");
    setDiscountPrice("");
    setStock("25");
    setImageUrl("/assets/hero-festive-hamper.png");
    setDescription("");
    setIsActive(true);
    setShowModal(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    const catId = typeof p.category === "object" ? p.category._id : p.category;
    setCategoryId(catId || (categories.length > 0 ? categories[0]._id : ""));
    setPrice(p.price.toString());
    setDiscountPrice(p.discountPrice ? p.discountPrice.toString() : "");
    setStock(p.stock.toString());
    setImageUrl(p.images && p.images.length > 0 ? p.images[0] : "");
    setDescription(p.description || "");
    setIsActive(p.isActive);
    setShowModal(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !categoryId || !price) {
      toast.error("Name, Category, and Price are required");
      return;
    }

    try {
      setIsSaving(true);
      const payload = {
        name: name.trim(),
        category: categoryId,
        price: parseFloat(price),
        discountPrice: discountPrice ? parseFloat(discountPrice) : undefined,
        stock: parseInt(stock, 10) || 0,
        images: imageUrl.trim() ? [imageUrl.trim()] : [],
        description: description.trim(),
        isActive,
      };

      if (editingProduct) {
        const res = await api.put(`/admin/products/${editingProduct._id}`, payload);
        if (res.data.success) {
          toast.success("Product updated successfully!");
          setShowModal(false);
          loadCatalog();
        }
      } else {
        const res = await api.post("/admin/products", payload);
        if (res.data.success) {
          toast.success("Product created successfully!");
          setShowModal(false);
          loadCatalog();
        }
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Failed to save product");
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async (p: Product) => {
    try {
      const res = await api.put(`/admin/products/${p._id}`, {
        isActive: !p.isActive,
      });
      if (res.data.success) {
        toast.success(
          `Product ${!p.isActive ? "activated on storefront" : "deactivated and hidden"}`
        );
        setProducts((prev) =>
          prev.map((item) =>
            item._id === p._id ? { ...item, isActive: !p.isActive } : item
          )
        );
      }
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDeleteProduct = async (p: Product) => {
    if (!confirm(`Are you sure you want to remove "${p.name}"?`)) return;

    try {
      const res = await api.delete(`/admin/products/${p._id}`);
      if (res.data.success) {
        toast.success(res.data.message);
        loadCatalog();
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Failed to delete product");
    }
  };

  return (
    <main className="p-6 md:p-8 space-y-6 max-w-6xl w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-slate-900">Products & Inventory</h1>
          <p className="text-xs text-slate-500">Manage pricing, stock levels, and storefront visibility</p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-3.5 py-2 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-xl shadow-glow flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <Plus size={15} /> Add New Product
        </button>
      </div>

      {/* Filter & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search size={16} className="absolute inset-y-0 left-3.5 my-auto text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search product by title or description..."
            className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 text-xs font-medium outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="flex gap-2 self-end sm:self-auto">
          <select
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value)}
            className="h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="true">Active Only</option>
            <option value="false">Inactive / Archived</option>
          </select>

          <button
            onClick={loadCatalog}
            className="h-10 px-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-1"
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Item</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price / Discount</th>
                <th className="py-3 px-4">Stock Level</th>
                <th className="py-3 px-4">Storefront Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">
                    Loading catalog items...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">
                    No products found.
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const catName =
                    typeof product.category === "object"
                      ? product.category?.name
                      : "General";

                  return (
                    <tr key={product._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 relative overflow-hidden shrink-0">
                          {product.images && product.images.length > 0 ? (
                            <Image
                              src={product.images[0]}
                              alt={product.name}
                              fill
                              className="object-contain p-1"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-sm">🪔</div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <span className="font-bold text-slate-900 block truncate max-w-xs">
                            {product.name}
                          </span>
                          <span className="font-mono text-[10px] text-slate-400">{product.slug}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-medium text-slate-600">{catName}</td>

                      <td className="py-3.5 px-4 font-serif">
                        <span className="font-bold text-slate-900">₹{product.price}</span>
                        {product.discountPrice && (
                          <span className="text-primary font-bold ml-1.5 text-[11px]">
                            (Sale: ₹{product.discountPrice})
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                            product.stock === 0
                              ? "bg-red-100 text-red-700"
                              : product.stock < 10
                              ? "bg-amber-100 text-amber-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {product.stock} in stock
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleToggleActive(product)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 transition-colors ${
                            product.isActive
                              ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          {product.isActive ? (
                            <>
                              <CheckCircle2 size={11} /> Live on Store
                            </>
                          ) : (
                            <>
                              <EyeOff size={11} /> Hidden / Inactive
                            </>
                          )}
                        </button>
                      </td>

                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => openEditModal(product)}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                          title="Edit product"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product)}
                          className="p-1.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg transition-colors"
                          title="Archive / Remove"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="font-serif text-lg font-bold text-slate-900">
                {editingProduct ? "Edit Product" : "Create New Product"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Product Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Pure Vedic Cow Ghee (500ml)"
                  className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-3 text-xs outline-none focus:ring-1 focus:ring-primary font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Category *</label>
                  <select
                    required
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-3 text-xs font-medium outline-none focus:ring-1 focus:ring-primary"
                  >
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Stock Quantity *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-3 text-xs outline-none focus:ring-1 focus:ring-primary font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Regular Price (₹) *</label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="499"
                    className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-3 text-xs outline-none focus:ring-1 focus:ring-primary font-medium font-serif"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Discount Price (₹)</label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    value={discountPrice}
                    onChange={(e) => setDiscountPrice(e.target.value)}
                    placeholder="Optional sale price"
                    className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-3 text-xs outline-none focus:ring-1 focus:ring-primary font-medium font-serif"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Image Asset Path / URL</label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="/assets/hero-festive-hamper.png or https://..."
                  className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-3 text-xs outline-none focus:ring-1 focus:ring-primary font-mono text-[11px]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Authentic pooja samagri and festive ritual ingredients..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none focus:ring-1 focus:ring-primary font-medium"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 text-primary rounded accent-primary"
                />
                <span className="text-xs text-slate-700 font-semibold">Active and visible to customers on storefront</span>
              </label>

              <button
                type="submit"
                disabled={isSaving}
                className="w-full py-3 bg-primary hover:bg-primary-dark text-white font-bold text-xs rounded-xl shadow-glow transition-colors disabled:opacity-60 mt-2"
              >
                {isSaving ? "Saving Product..." : editingProduct ? "Update Product" : "Create Product"}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
