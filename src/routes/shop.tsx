import { createFileRoute, Outlet } from "@tanstack/react-router";

import { isCategorySlug } from "@/lib/catalog";
import type { SortKey } from "@/lib/catalog";

export interface ShopSearch {
  category?: string | undefined;
  q?: string | undefined;
  sort?: SortKey | undefined;
}

const SORTS: SortKey[] = ["featured", "newest", "price-asc", "price-desc", "name-asc"];

export const Route = createFileRoute("/shop")({
  validateSearch: (search: Record<string, unknown>): ShopSearch => {
    const rawSort = search["sort"];
    const rawCategory = search["category"];
    const rawQuery = search["q"];
    return {
      category: isCategorySlug(rawCategory) ? rawCategory : undefined,
      q: typeof rawQuery === "string" && rawQuery.length > 0 ? rawQuery : undefined,
      sort: SORTS.includes(rawSort as SortKey) ? (rawSort as SortKey) : undefined,
    };
  },
  component: () => <Outlet />,
});
