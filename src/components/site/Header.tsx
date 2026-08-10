import * as React from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, MessageCircle, Search, ShoppingBag, X, Minus, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useCart } from "@/lib/cart";
import { COMPANY, whatsappLink } from "@/lib/company";
import { formatPrice } from "@/lib/i18n";
import { categories, products } from "@/data/catalog";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  { label: "Services", to: "/services" },
  { label: "Projects", to: "/projects" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
] as const;

function CartPanel() {
  const { lines, subtotal, setQty, remove, count } = useCart();

  if (count === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
        <ShoppingBag className="size-6 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Your cart is empty.</p>
        <Button asChild variant="outline" size="sm">
          <Link to="/shop">Browse the catalogue</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="flex-1 space-y-6 overflow-y-auto py-6">
        {lines.map((line) => (
          <div key={line.id} className="grid grid-cols-[64px_minmax(0,1fr)_auto] gap-4">
            <div className="media-frame aspect-square rounded-xs">
              <img src={line.image} alt={line.name} loading="lazy" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{line.name}</p>
              <p className="mt-1 text-xs text-muted-foreground tabular-nums">
                {formatPrice(line.price)}
              </p>
              <div className="mt-2 flex items-center gap-1">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() => setQty(line.id, line.qty - 1)}
                  className="grid size-7 cursor-pointer place-items-center border border-hairline hover:bg-accent"
                >
                  <Minus className="size-3" />
                </button>
                <span className="w-8 text-center text-xs tabular-nums">{line.qty}</span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() => setQty(line.id, line.qty + 1)}
                  className="grid size-7 cursor-pointer place-items-center border border-hairline hover:bg-accent"
                >
                  <Plus className="size-3" />
                </button>
              </div>
            </div>
            <button
              type="button"
              aria-label={`Remove ${line.name}`}
              onClick={() => remove(line.id)}
              className="cursor-pointer self-start text-muted-foreground transition-colors hover:text-destructive"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="hairline-t pt-5">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-semibold tabular-nums">{formatPrice(subtotal)}</span>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Delivery and installation are quoted per project.
        </p>
        <Button asChild className="mt-4 w-full" size="lg">
          <a href={whatsappLink("Hi, I'd like a quote for the items in my cart.")} target="_blank" rel="noreferrer">
            <MessageCircle className="size-4" />
            Request a quote
          </a>
        </Button>
      </div>
    </>
  );
}

function SearchDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [query, setQuery] = React.useState("");
  const q = query.trim().toLowerCase();
  const results = q
    ? products.filter(
        (p) => p.name.toLowerCase().includes(q) || p.material.toLowerCase().includes(q),
      )
    : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="top-24 max-w-xl translate-y-0 gap-0 rounded-sm border-hairline p-0">
        <div className="hairline-b flex items-center gap-3 px-5 py-4">
          <Search className="size-4 text-muted-foreground" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search desks, chairs, storage…"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        <div className="max-h-80 overflow-y-auto p-2">
          {q && results.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">
              No products match “{query}”.
            </p>
          ) : null}
          {(q ? results : products.slice(0, 5)).map((p) => (
            <Link
              key={p.id}
              to="/shop"
              search={{ category: p.category }}
              onClick={() => onOpenChange(false)}
              className="flex items-center gap-4 rounded-xs px-3 py-2.5 transition-colors hover:bg-accent"
            >
              <div className="media-frame size-11 shrink-0 rounded-xs">
                <img src={p.images[0]} alt="" loading="lazy" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{p.name}</p>
                <p className="truncate text-xs text-muted-foreground">{p.material}</p>
              </div>
              <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                {formatPrice(p.price)}
              </span>
            </Link>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function Header() {
  const { count, open, setOpen } = useCart();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div className="hidden bg-primary text-primary-foreground md:block">
        <div className="container-page flex h-9 items-center justify-between text-[0.6875rem] tracking-[0.08em] uppercase">
          <p>Free workspace planning consultation · {COMPANY.hours}</p>
          <a href={`tel:${COMPANY.phone.replace(/\s/g, "")}`} className="hover:text-clay">
            {COMPANY.phone}
          </a>
        </div>
      </div>

      <header
        className={cn(
          "sticky top-0 z-50 border-b border-transparent bg-background/90 backdrop-blur-md transition-colors",
          scrolled && "border-hairline",
        )}
      >
        <div className="container-page grid h-16 grid-cols-[auto_1fr_auto] items-center gap-4 md:h-20">
          <Link to="/" className="flex min-w-0 items-center gap-3">
            <span className="grid size-8 shrink-0 place-items-center bg-primary text-primary-foreground font-display text-lg leading-none">
              {COMPANY.name.charAt(0)}
            </span>
            <span className="truncate">
              <span className="block text-sm font-semibold tracking-[0.14em] uppercase">
                {COMPANY.name}
              </span>
              <span className="hidden text-[0.625rem] tracking-[0.14em] uppercase text-muted-foreground lg:block">
                Office furniture studio
              </span>
            </span>
          </Link>

          <nav className="hidden justify-center gap-8 lg:flex">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-foreground",
                  pathname === item.to && "text-foreground",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center justify-end gap-1">
            <button
              type="button"
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
              className="grid size-10 cursor-pointer place-items-center rounded-sm transition-colors hover:bg-accent"
            >
              <Search className="size-4" />
            </button>

            <a
              href={whatsappLink()}
              target="_blank"
              rel="noreferrer"
              className="hidden h-10 items-center gap-2 rounded-sm bg-clay px-4 text-xs font-semibold uppercase tracking-[0.1em] text-clay-foreground transition-opacity hover:opacity-90 sm:inline-flex"
            >
              <MessageCircle className="size-4" />
              WhatsApp
            </a>

            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <button
                  type="button"
                  aria-label={`Cart, ${count} items`}
                  className="relative grid size-10 cursor-pointer place-items-center rounded-sm transition-colors hover:bg-accent"
                >
                  <ShoppingBag className="size-4" />
                  {count > 0 ? (
                    <span className="absolute top-1 end-1 grid min-w-4 place-items-center rounded-full bg-clay px-1 text-[0.5625rem] font-bold text-clay-foreground tabular-nums">
                      {count}
                    </span>
                  ) : null}
                </button>
              </SheetTrigger>
              <SheetContent className="flex w-full flex-col sm:max-w-md">
                <SheetHeader>
                  <SheetTitle className="label-caps">Your cart</SheetTitle>
                </SheetHeader>
                <CartPanel />
              </SheetContent>
            </Sheet>

            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <button
                  type="button"
                  aria-label="Open menu"
                  className="grid size-10 cursor-pointer place-items-center rounded-sm transition-colors hover:bg-accent lg:hidden"
                >
                  <Menu className="size-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full sm:max-w-sm">
                <div className="flex h-full flex-col">
                  <div className="flex items-center justify-between">
                    <span className="label-caps">Menu</span>
                    <button
                      type="button"
                      aria-label="Close menu"
                      onClick={() => setMenuOpen(false)}
                      className="grid size-9 cursor-pointer place-items-center hover:bg-accent"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                  <nav className="mt-10 flex flex-col">
                    {NAV.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setMenuOpen(false)}
                        className="hairline-b py-4 font-display text-3xl transition-colors hover:text-clay"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </nav>
                  <div className="mt-8">
                    <p className="eyebrow">Shop by category</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {categories.slice(0, 6).map((c) => (
                        <Link
                          key={c.slug}
                          to="/shop"
                          search={{ category: c.slug }}
                          onClick={() => setMenuOpen(false)}
                          className="border border-hairline px-3 py-1.5 text-xs text-muted-foreground hover:border-foreground hover:text-foreground"
                        >
                          {c.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div className="mt-auto pt-8">
                    <Button asChild variant="clay" className="w-full" size="lg">
                      <a href={whatsappLink()} target="_blank" rel="noreferrer">
                        <MessageCircle className="size-4" />
                        WhatsApp us
                      </a>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
