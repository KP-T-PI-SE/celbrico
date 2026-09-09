import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ProductItem {
  _id: string;
  name: string;
  slug: string;
  price: number;
  discountPrice?: number;
  stock: number;
  images: string[];
  description?: string;
  category?: {
    _id: string;
    name: string;
    slug: string;
  };
}

export interface CartItem {
  product: ProductItem;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (product: ProductItem, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
  getDeliveryFee: () => number;
  getTotalAmount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product: ProductItem, quantity = 1) => {
        const currentItems = get().items;
        const existingIndex = currentItems.findIndex((i) => i.product._id === product._id);

        if (existingIndex > -1) {
          const updatedItems = [...currentItems];
          const newQty = Math.min(
            product.stock || 99,
            updatedItems[existingIndex].quantity + quantity
          );
          updatedItems[existingIndex] = {
            ...updatedItems[existingIndex],
            quantity: newQty,
          };
          set({ items: updatedItems });
        } else {
          set({ items: [...currentItems, { product, quantity }] });
        }
      },

      removeItem: (productId: string) => {
        set({ items: get().items.filter((i) => i.product._id !== productId) });
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        set({
          items: get().items.map((item) =>
            item.product._id === productId
              ? { ...item, quantity: Math.min(item.product.stock || 99, quantity) }
              : item
          ),
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalItems: () => {
        return get().items.reduce((acc, item) => acc + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce((acc, item) => {
          const price = item.product.discountPrice && item.product.discountPrice > 0
            ? item.product.discountPrice
            : item.product.price;
          return acc + price * item.quantity;
        }, 0);
      },

      getDeliveryFee: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0) return 0;
        return subtotal >= 499 ? 0 : 49;
      },

      getTotalAmount: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0) return 0;
        return subtotal + get().getDeliveryFee();
      },
    }),
    {
      name: 'celbrico-cart',
    }
  )
);
