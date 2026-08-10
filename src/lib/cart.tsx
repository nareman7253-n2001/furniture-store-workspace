import * as React from "react";
import { toast } from "sonner";
import type { Product } from "@/data/catalog";

export interface CartLine {
  id: string;
  name: string;
  price: number;
  image: string;
  qty: number;
}

interface CartValue {
  lines: CartLine[];
  count: number;
  subtotal: number;
  add: (product: Product, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const CartContext = React.createContext<CartValue | null>(null);
const STORAGE_KEY = "aw.cart.v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = React.useState<CartLine[]>([]);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw) as CartLine[]);
    } catch {
      /* ignore */
    }
  }, []);

  React.useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* ignore */
    }
  }, [lines]);

  const value = React.useMemo<CartValue>(() => {
    const add: CartValue["add"] = (product, qty = 1) => {
      setLines((prev) => {
        const existing = prev.find((l) => l.id === product.id);
        if (existing) {
          return prev.map((l) => (l.id === product.id ? { ...l, qty: l.qty + qty } : l));
        }
        return [
          ...prev,
          { id: product.id, name: product.name, price: product.price, image: product.image, qty },
        ];
      });
      toast.success("Added to cart", { description: product.name });
      setOpen(true);
    };

    return {
      lines,
      count: lines.reduce((n, l) => n + l.qty, 0),
      subtotal: lines.reduce((n, l) => n + l.qty * l.price, 0),
      add,
      remove: (id) => setLines((prev) => prev.filter((l) => l.id !== id)),
      setQty: (id, qty) =>
        setLines((prev) =>
          qty <= 0
            ? prev.filter((l) => l.id !== id)
            : prev.map((l) => (l.id === id ? { ...l, qty } : l)),
        ),
      clear: () => setLines([]),
      open,
      setOpen,
    };
  }, [lines, open]);

  return React.createElement(CartContext.Provider, { value }, children);
}

export function useCart() {
  const ctx = React.useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
