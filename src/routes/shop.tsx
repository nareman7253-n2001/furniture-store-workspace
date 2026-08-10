import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";

import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { ProductCard } from "@/components/site/cards";
import { CTASection } from "@/components/site/CTASection";
import { Button } from "@/components/ui/button";
import { categories, products } from "@/data/catalog";
import { cn } from "@/lib/utils";

interface ShopSearch {
  category?: string | undefined;
  sort?: "featured" | "price-asc" | "price-desc" | undefined;
}

export const Route = createFileRoute("/shop")({
  validateSearch: (search: Record<string, unknown>): ShopSearch => {
    const rawSort = search["sort"];
    const rawCategory = search["category"];
    return {
      category: typeof rawCategory === "string" ? rawCategory : undefined,
      sort:
        rawSort === "price-asc" || rawSort === "price-desc" || rawSort === "featured"
          ? rawSort
          : undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "Shop Office Furniture — Desks, Chairs & Storage | Atelier Works" },
      {
        name: "description",
        content:
          "Browse contract-grade office desks, ergonomic chairs, executive and reception furniture, storage, meeting tables and workstations.",
      },
      { property: "og:title", content: "Shop Office Furniture | Atelier Works" },
      {
        property: "og:description",
        content: "Contract-grade office furniture with delivery and installation included.",
      },
    ],
  }),
  component: Shop,
});

function Shop() {
  const { category, sort } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [maxPrice, setMaxPrice] = React.useState(7000);

  const filtered = React.useMemo(() => {
    let list = products.filter((p) => p.price <= maxPrice);
    if (category) list = list.filter((p) => p.category === category);
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [category, sort, maxPrice]);

  const active = categories.find((c) => c.slug === category);

  return (
    <>
      <section className="container-page pt-8 pb-12">
        <Breadcrumbs
          items={active ? [{ label: "Shop", to: "/shop" }, { label: active.name }] : [{ label: "Shop" }]}
        />
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <div>
            <p className="eyebrow">Catalogue</p>
            <h1 className="display-lg mt-4">{active ? active.name : "Office furniture"}</h1>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground lg:justify-self-end">
            {active
              ? active.description
              : "Contract-grade pieces specified for daily commercial use. Trade pricing available on projects over 10 desks."}
          </p>
        </div>
      </section>

      <section className="hairline-t">
        <div className="container-page py-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
              <FilterChip
                active={!category}
                onClick={() => navigate({ search: (prev: ShopSearch) => ({ ...prev, category: undefined }) })}
              >
                All
              </FilterChip>
              {categories.map((c) => (
                <FilterChip
                  key={c.slug}
                  active={category === c.slug}
                  onClick={() => navigate({ search: (prev: ShopSearch) => ({ ...prev, category: c.slug }) })}
                >
                  {c.name}
                </FilterChip>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <label className="flex items-center gap-3 text-xs text-muted-foreground">
                Max price
                <input
                  type="range"
                  min={200}
                  max={7000}
                  step={100}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-32 accent-clay"
                />
                <span className="w-14 text-foreground tabular-nums">${maxPrice}</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-muted-foreground">
                Sort
                <select
                  value={sort ?? "featured"}
                  onChange={(e) =>
                    navigate({
                      search: (prev: ShopSearch) => ({ ...prev, sort: e.target.value as ShopSearch["sort"] }),
                    })
                  }
                  className="h-9 cursor-pointer rounded-sm border border-input bg-card px-2 text-xs text-foreground outline-none"
                >
                  <option value="featured">Featured</option>
                  <option value="price-asc">Price: low to high</option>
                  <option value="price-desc">Price: high to low</option>
                </select>
              </label>
            </div>
          </div>
        </div>
      </section>

      <section className="hairline-t pt-12 pb-20">
        <div className="container-page">
          <p className="text-xs text-muted-foreground">
            {filtered.length} {filtered.length === 1 ? "product" : "products"}
          </p>
          {filtered.length === 0 ? (
            <div className="py-24 text-center">
              <p className="font-display text-2xl">Nothing matches those filters.</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-6"
                onClick={() => {
                  setMaxPrice(7000);
                  navigate({ search: {} });
                }}
              >
                Reset filters
              </Button>
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}

          <div className="hairline-t mt-20 pt-10">
            <p className="eyebrow">Not sure what you need?</p>
            <p className="mt-3 max-w-xl text-sm text-muted-foreground">
              Send us a floor plan and a headcount — we'll build a specification and quote around
              your budget.{" "}
              <Link to="/contact" className="link-underline text-foreground">
                Talk to a consultant
              </Link>
            </p>
          </div>
        </div>
      </section>

      <CTASection eyebrow="Trade enquiries" title="Furnishing more than ten desks?" />
    </>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "shrink-0 cursor-pointer whitespace-nowrap border px-4 py-2 text-xs transition-colors",
        active
          ? "border-foreground bg-primary text-primary-foreground"
          : "border-hairline text-muted-foreground hover:border-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}
