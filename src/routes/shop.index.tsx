import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, SlidersHorizontal, X } from "lucide-react";

import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { ProductCard } from "@/components/site/cards";
import { CTASection } from "@/components/site/CTASection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  AVAILABILITIES,
  CONDITIONS,
  SORT_OPTIONS,
  getCategory,
  priceBounds,
  queryProducts,
  type SortKey,
} from "@/lib/catalog";
import type { Category } from "@/data/catalog";
import { COMPANY } from "@/lib/company";
import { useCms } from "@/lib/cms";
import { useLocale } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { ShopSearch } from "./shop";


export const Route = createFileRoute("/shop/")({
  head: () => ({
    meta: [
      { title: `Shop Office Furniture — Desks, Chairs & Storage | ${COMPANY.name}` },
      {
        name: "description",
        content:
          "Browse office desks, ergonomic chairs, executive and reception furniture, storage, meeting tables and workstations. New and used, delivered and installed.",
      },
      { property: "og:title", content: `Shop Office Furniture | ${COMPANY.name}` },
      {
        property: "og:description",
        content: "Office furniture for every workspace — new and used, with delivery and installation.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ShopIndex,
});

function ShopIndex() {
  const { category, sort, q } = Route.useSearch();
  const navigate = Route.useNavigate();
  const { categories, products } = useCms();
  const { price: formatPrice, t } = useLocale();

  const bounds = React.useMemo(() => priceBounds(products), [products]);

  const [conditions, setConditions] = React.useState<string[]>([]);
  const [availabilities, setAvailabilities] = React.useState<string[]>([]);
  const [maxPrice, setMaxPrice] = React.useState<number | null>(null);
  const [filtersOpen, setFiltersOpen] = React.useState(false);

  const effectiveMax = maxPrice ?? bounds.max;

  const setSearch = (next: Partial<ShopSearch>) =>
    navigate({ search: (prev: ShopSearch) => ({ ...prev, ...next }) });

  const results = React.useMemo(
    () =>
      queryProducts(
        {
          search: q ?? "",
          category,
          conditions,
          availabilities,
          maxPrice: effectiveMax,
          sort: sort ?? "featured",
        },
        products,
      ),
    [q, category, conditions, availabilities, effectiveMax, sort, products],
  );

  const active = getCategory(category, categories);
  const filtersDirty =
    Boolean(category) ||
    Boolean(q) ||
    conditions.length > 0 ||
    availabilities.length > 0 ||
    maxPrice !== null;

  const resetFilters = () => {
    setConditions([]);
    setAvailabilities([]);
    setMaxPrice(null);
    navigate({ search: {} });
  };

  const toggle = (list: string[], value: string, set: (v: string[]) => void) =>
    set(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

  const filterPanel = (
    <FilterPanel
      categories={categories}
      bounds={bounds}
      formatPrice={formatPrice}
      label={t("shop.filters")}
      category={category}
      onCategory={(value) => setSearch({ category: value })}
      conditions={conditions}
      onCondition={(value) => toggle(conditions, value, setConditions)}
      availabilities={availabilities}
      onAvailability={(value) => toggle(availabilities, value, setAvailabilities)}
      maxPrice={effectiveMax}
      onMaxPrice={setMaxPrice}
      onReset={resetFilters}
      dirty={filtersDirty}
    />
  );


  return (
    <>
      {/* ---------------- shop header ---------------- */}
      <section className="container-page pt-8 pb-12">
        <Breadcrumbs
          items={
            active ? [{ label: "Shop", to: "/shop" }, { label: active.name }] : [{ label: "Shop" }]
          }
        />
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <div>
            <p className="eyebrow">Office furniture</p>
            <h1 className="display-lg mt-4">
              {active ? active.name : "Furniture for Every Workspace"}
            </h1>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground lg:justify-self-end">
            {active
              ? active.description
              : "Explore office furniture designed for productive, professional and comfortable work environments."}
          </p>
        </div>

        {/* ---------------- search ---------------- */}
        <div className="relative mt-10 max-w-2xl">
          <Search className="pointer-events-none absolute start-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={q ?? ""}
            onChange={(e) => setSearch({ q: e.target.value || undefined })}
            placeholder="Search desks, chairs, storage, meeting tables..."
            aria-label="Search products"
            className="h-14 ps-11 pe-11 text-sm"
          />
          {q ? (
            <button
              type="button"
              onClick={() => setSearch({ q: undefined })}
              aria-label="Clear search"
              className="absolute end-4 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          ) : null}
        </div>
      </section>

      {/* ---------------- category navigation ---------------- */}
      <section className="hairline-t">
        <div className="container-page py-5">
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
            <CategoryChip active={!category} onClick={() => setSearch({ category: undefined })}>
              All Furniture
            </CategoryChip>
            {categories.map((c) => (
              <CategoryChip
                key={c.slug}
                active={category === c.slug}
                onClick={() => setSearch({ category: c.slug })}
              >
                {c.name}
              </CategoryChip>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- results ---------------- */}
      <section className="hairline-t pt-10 pb-20">
        <div className="container-page grid gap-10 lg:grid-cols-[240px_minmax(0,1fr)]">
          <aside className="hidden lg:block">{filterPanel}</aside>

          <div>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="text-xs text-muted-foreground">
                {results.length} {results.length === 1 ? "product" : "products"}
              </p>

              <div className="flex items-center gap-3">
                <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="lg:hidden">
                      <SlidersHorizontal className="size-3.5" />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[85vw] max-w-sm overflow-y-auto">
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                    </SheetHeader>
                    <div className="px-4 pb-8">{filterPanel}</div>
                  </SheetContent>
                </Sheet>

                <label className="flex items-center gap-2 text-xs text-muted-foreground">
                  Sort
                  <select
                    value={sort ?? "featured"}
                    onChange={(e) => setSearch({ sort: e.target.value as SortKey })}
                    className="h-9 cursor-pointer rounded-sm border border-input bg-card px-2 text-xs text-foreground outline-none"
                  >
                    {SORT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>

            {results.length === 0 ? (
              <div className="py-24 text-center">
                <p className="font-display text-2xl">No products found</p>
                <p className="mt-3 text-sm text-muted-foreground">
                  Try changing your filters or search terms.
                </p>
                <Button variant="outline" size="sm" className="mt-6" onClick={resetFilters}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-12 sm:gap-x-6 lg:grid-cols-3">
                {results.map((p) => (
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
        </div>
      </section>

      <CTASection eyebrow="Trade enquiries" title="Furnishing more than ten desks?" />
    </>
  );
}

/* -------------------------------------------------- filter panel */

function FilterPanel({
  categories,
  bounds,
  formatPrice,
  label,
  category,
  onCategory,
  conditions,
  onCondition,
  availabilities,
  onAvailability,
  maxPrice,
  onMaxPrice,
  onReset,
  dirty,
}: {
  categories: Category[];
  bounds: { min: number; max: number };
  formatPrice: (value: number) => string;
  label: string;
  category?: string | undefined;
  onCategory: (value: string | undefined) => void;
  conditions: string[];
  onCondition: (value: string) => void;
  availabilities: string[];
  onAvailability: (value: string) => void;
  maxPrice: number;
  onMaxPrice: (value: number) => void;
  onReset: () => void;
  dirty: boolean;
}) {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <p className="eyebrow">{label}</p>
        {dirty ? (
          <button
            type="button"
            onClick={onReset}
            className="link-underline cursor-pointer text-xs text-muted-foreground hover:text-foreground"
          >
            Reset filters
          </button>
        ) : null}
      </div>

      <FilterGroup label="Category">
        <FilterOption
          label="All Furniture"
          checked={!category}
          onChange={() => onCategory(undefined)}
        />
        {categories.map((c) => (
          <FilterOption
            key={c.slug}
            label={c.name}
            checked={category === c.slug}
            onChange={() => onCategory(category === c.slug ? undefined : c.slug)}
          />
        ))}
      </FilterGroup>

      <FilterGroup label="Condition">
        {CONDITIONS.map((value) => (
          <FilterOption
            key={value}
            label={value}
            checked={conditions.includes(value)}
            onChange={() => onCondition(value)}
          />
        ))}
      </FilterGroup>

      <FilterGroup label="Availability">
        {AVAILABILITIES.map((value) => (
          <FilterOption
            key={value}
            label={value}
            checked={availabilities.includes(value)}
            onChange={() => onAvailability(value)}
          />
        ))}
      </FilterGroup>

      <FilterGroup label="Price range">
        <input
          type="range"
          min={bounds.min}
          max={bounds.max}
          step={100}
          value={maxPrice}
          onChange={(e) => onMaxPrice(Number(e.target.value))}
          aria-label="Maximum price"
          className="w-full accent-clay"
        />
        <p className="flex items-center justify-between text-xs text-muted-foreground tabular-nums">
          <span>{formatPrice(bounds.min)}</span>
          <span className="text-foreground">Up to {formatPrice(maxPrice)}</span>
        </p>
      </FilterGroup>
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-hairline pt-5">
      <p className="text-xs font-semibold uppercase tracking-[0.12em]">{label}</p>
      <div className="mt-4 space-y-3">{children}</div>
    </div>
  );
}

function FilterOption({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 text-xs text-muted-foreground hover:text-foreground">
      <Checkbox checked={checked} onCheckedChange={() => onChange()} />
      {label}
    </label>
  );
}

function CategoryChip({
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
