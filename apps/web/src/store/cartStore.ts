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
  isActive?: boolean;
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
  addItem: (product: ProductItem, quantity?: number) => boolean;
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
        // Prevent adding out-of-stock or deactivated items
        if (product.isActive === false || product.stock <= 0) {
          return false;
        }

        const currentItems = get().items;
        const existingIndex = currentItems.findIndex((i) => i.product._id === product._id);

        if (existingIndex > -1) {
          const currentQty = currentItems[existingIndex].quantity;
          if (currentQty >= product.stock) {
            return false;
          }

          const newQty = Math.min(product.stock, currentQty + quantity);
          const updatedItems = [...currentItems];
          updatedItems[existingIndex] = {
            ...updatedItems[existingIndex],
            quantity: newQty,
          };
          set({ items: updatedItems });
          return true;
        } else {
          const initialQty = Math.min(product.stock, Math.max(1, quantity));
          if (initialQty > 0) {
            set({ items: [...currentItems, { product, quantity: initialQty }] });
            return true;
          }
          return false;
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
          const price =
            item.product.discountPrice && item.product.discountPrice > 0
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
