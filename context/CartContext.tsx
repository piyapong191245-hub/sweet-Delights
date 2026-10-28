"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "@/data/products";

export type DeliveryType = "delivery" | "pickup";
export type PaymentMethod = "promptpay" | "cod" | "credit";

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  name: string;
  phone: string;
  address: string;
  date: string;
  time: string;
  note: string;
  deliveryType: DeliveryType;
  paymentMethod: PaymentMethod;
  items: CartItem[];
  shipping: number;
  total: number;
  createdAt: string;
}

interface Toast {
  id: number;
  message: string;
}

const SHIPPING_FEE = 40;

interface CartContextValue {
  cart: CartItem[];
  totalItems: number;
  subtotal: number;
  shippingFee: number;
  total: number;
  note: string;
  setNote: (note: string) => void;
  deliveryType: DeliveryType;
  setDeliveryType: (type: DeliveryType) => void;
  addToCart: (product: Product) => void;
  updateQuantity: (productId: number, change: number) => void;
  clearCart: () => void;
  placeOrder: (
    info: Omit<
      Order,
      "id" | "items" | "shipping" | "total" | "createdAt" | "note"
    >,
  ) => void;
  // UI state
  cartOpen: boolean;
  checkoutOpen: boolean;
  order: Order | null;
  toasts: Toast[];
  toggleCart: () => void;
  openCheckout: () => void;
  closeCheckout: () => void;
  closeReceipt: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [note, setNote] = useState("");
  const [deliveryType, setDeliveryType] = useState<DeliveryType>("delivery");
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const addToCart = useCallback(
    (product: Product) => {
      setCart((prev) => {
        const existing = prev.find((i) => i.id === product.id);
        if (existing) {
          return prev.map((i) =>
            i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i,
          );
        }
        return [...prev, { ...product, quantity: 1 }];
      });
      showToast(`เพิ่ม "${product.name}" ลงในตะกร้าแล้ว!`);
    },
    [showToast],
  );

  const updateQuantity = useCallback((productId: number, change: number) => {
    setCart((prev) =>
      prev
        .map((i) =>
          i.id === productId ? { ...i, quantity: i.quantity + change } : i,
        )
        .filter((i) => i.quantity > 0),
    );
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    setNote("");
  }, []);

  const totalItems = useMemo(
    () => cart.reduce((sum, i) => sum + i.quantity, 0),
    [cart],
  );
  const subtotal = useMemo(
    () => cart.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [cart],
  );
  const shippingFee = deliveryType === "delivery" ? SHIPPING_FEE : 0;
  const total = subtotal > 0 ? subtotal + shippingFee : 0;

  const placeOrder: CartContextValue["placeOrder"] = useCallback(
    (info) => {
      const newOrder: Order = {
        ...info,
        note,
        id: "SD-" + Math.floor(100000 + Math.random() * 900000),
        items: cart,
        shipping: shippingFee,
        total: subtotal + shippingFee,
        createdAt: new Date().toLocaleDateString("th-TH"),
      };
      setOrder(newOrder);
      setCheckoutOpen(false);
      setCart([]);
      setNote("");
    },
    [cart, note, shippingFee, subtotal],
  );

  const closeReceipt = useCallback(() => {
    setOrder(null);
    showToast("ขอบคุณสำหรับการสั่งซื้อครับ!");
  }, [showToast]);

  const value: CartContextValue = {
    cart,
    totalItems,
    subtotal,
    shippingFee,
    total,
    note,
    setNote,
    deliveryType,
    setDeliveryType,
    addToCart,
    updateQuantity,
    clearCart,
    placeOrder,
    cartOpen,
    checkoutOpen,
    order,
    toasts,
    toggleCart: () => setCartOpen((o) => !o),
    openCheckout: () => {
      setCartOpen(false);
      setCheckoutOpen(true);
    },
    closeCheckout: () => setCheckoutOpen(false),
    closeReceipt,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}