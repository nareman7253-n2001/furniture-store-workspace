import { createFileRoute, Outlet } from "@tanstack/react-router";

import type { SortKey } from "@/lib/catalog";

export interface ShopSearch {
  category?: string | undefined;
  q?: string | undefined;
  sort?: SortKey | undefined;
}

const SORTS: SortKey[] = ["featured", "newest", "price-asc", "price-desc", "name-asc"];
const SLUG = /^[a-z0-9-]{1,80}$/;

export const Route = createFileRoute("/shop")({
  validateSearch: (search: Record<string, unknown>): ShopSearch => {
    const rawSort = search["sort"];
    const rawCategory = search["category"];
    const rawQuery = search["q"];
    return {
      // Categories are managed in the control panel, so any well-formed slug is allowed.
      category: typeof rawCategory === "string" && SLUG.test(rawCategory) ? rawCategory : undefined,
      q: typeof rawQuery === "string" && rawQuery.length > 0 ? rawQuery.slice(0, 100) : undefined,
      sort: SORTS.includes(rawSort as SortKey) ? (rawSort as SortKey) : undefined,
    };
  },

  component: () => <Outlet />,
});
