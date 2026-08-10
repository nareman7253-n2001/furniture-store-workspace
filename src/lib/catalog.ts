import {
  categories,
  products,
  type Category,
  type CategorySlug,
  type Product,
} from "@/data/catalog";

/**
 * Catalogue access layer.
 *
 * The Shop UI only talks to these functions, never to the raw arrays. When the
 * catalogue moves to a real database, replace the bodies with server functions
 * (`createServerFn`) returning the same shapes — no UI changes required.
 */

export interface ProductQuery {
  search?: string;
  category?: string | undefined;
  conditions?: string[];
  availabilities?: string[];
  minPrice?: number;
  maxPrice?: number;
  sort?: SortKey;
}

export type SortKey = "featured" | "newest" | "price-asc" | "price-desc" | "name-asc";

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A-Z" },
];

export const CONDITIONS = ["New", "Used"] as const;
export const AVAILABILITIES = ["In stock", "Made to order"] as const;

export function listCategories(): Category[] {
  return categories;
}

export function getCategory(slug?: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function relatedProducts(product: Product, limit = 4): Product[] {
  return products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .concat(products.filter((p) => p.id !== product.id && p.category !== product.category))
    .slice(0, limit);
}

export function priceBounds(): { min: number; max: number } {
  const values = products.map((p) => p.price);
  return { min: Math.min(...values), max: Math.max(...values) };
}

export function queryProducts(query: ProductQuery = {}): Product[] {
  const {
    search = "",
    category,
    conditions = [],
    availabilities = [],
    minPrice,
    maxPrice,
    sort = "featured",
  } = query;

  const term = search.trim().toLowerCase();

  let list = products.filter((p) => {
    if (category && p.category !== category) return false;
    if (conditions.length && !conditions.includes(p.condition)) return false;
    if (availabilities.length && !availabilities.includes(p.availability)) return false;
    if (typeof minPrice === "number" && p.price < minPrice) return false;
    if (typeof maxPrice === "number" && p.price > maxPrice) return false;
    if (term) {
      const haystack = [p.name, p.description, p.material, p.category, ...p.colorways]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(term)) return false;
    }
    return true;
  });

  list = [...list];
  switch (sort) {
    case "price-asc":
      list.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      list.sort((a, b) => b.price - a.price);
      break;
    case "name-asc":
      list.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "newest":
      list.sort((a, b) => b.addedAt.localeCompare(a.addedAt));
      break;
    default:
      list.sort((a, b) => Number(b.featured) - Number(a.featured));
  }
  return list;
}

export function isCategorySlug(value: unknown): value is CategorySlug {
  return typeof value === "string" && categories.some((c) => c.slug === value);
}
