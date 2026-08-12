import * as React from "react";
import { useQuery } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import { resolveImage } from "@/lib/assets";
import { useLocale, type Locale } from "@/lib/i18n";
import { COMPANY } from "@/lib/company";
import {
  categories as staticCategories,
  products as staticProducts,
  projects as staticProjects,
  services as staticServices,
  type Category,
  type Product,
  type Project,
  type Service,
} from "@/data/catalog";

/* -------------------------------------------------- types */

export interface SiteSettings {
  name: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  facebook: string;
  address: string;
  hours: string;
}

export interface CmsData {
  settings: SiteSettings;
  texts: Record<string, string>;
  categories: Category[];
  products: Product[];
  services: Service[];
  projects: Project[];
}

// Loose row shape: generated DB types are indexed, so we normalise here.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Row = any;

/* -------------------------------------------------- helpers */

function pick(row: Row, field: string, locale: Locale): string {
  const value = row[`${field}_${locale}`];
  if (typeof value === "string" && value.trim()) return value;
  return row[`${field}_en`] ?? "";
}

function pickArray(row: Row, field: string, locale: Locale): string[] {
  const value = row[`${field}_${locale}`];
  if (Array.isArray(value) && value.length) return value;
  return Array.isArray(row[`${field}_en`]) ? row[`${field}_en`] : [];
}

export const FALLBACK: CmsData = {
  settings: { ...COMPANY },
  texts: {},
  categories: staticCategories,
  products: staticProducts,
  services: staticServices,
  projects: staticProjects,
};

/* -------------------------------------------------- fetching */

export async function fetchCmsRaw() {
  const [settings, texts, categories, products, services, projects] = await Promise.all([
    supabase.from("site_settings").select("*").maybeSingle(),
    supabase.from("site_texts").select("*"),
    supabase.from("categories").select("*").order("sort"),
    supabase.from("products").select("*").order("sort"),
    supabase.from("services").select("*").order("sort"),
    supabase.from("projects").select("*").order("sort"),
  ]);

  return {
    settings: (settings.data ?? null) as Row | null,
    texts: (texts.data ?? []) as Row[],
    categories: (categories.data ?? []) as Row[],
    products: (products.data ?? []) as Row[],
    services: (services.data ?? []) as Row[],
    projects: (projects.data ?? []) as Row[],
  };
}

export type CmsRaw = Awaited<ReturnType<typeof fetchCmsRaw>>;

export const CMS_QUERY_KEY = ["cms"] as const;

function localize(raw: CmsRaw, locale: Locale): CmsData {
  const activeCategories = raw.categories.filter((c) => c.active);
  const activeProducts = raw.products.filter((p) => p.active);

  const categories: Category[] = activeCategories.map((c) => ({
    slug: c.slug,
    name: pick(c, "name", locale),
    description: pick(c, "description", locale),
    image: resolveImage(c.image),
    count: activeProducts.filter((p) => p.category_slug === c.slug).length,
  })) as Category[];

  const products: Product[] = activeProducts.map((p) => ({
    id: p.id,
    slug: p.slug,
    category: p.category_slug,
    name: pick(p, "name", locale),
    description: pick(p, "description", locale),
    details: pick(p, "details", locale),
    price: Number(p.price),
    compareAt: p.compare_at == null ? undefined : Number(p.compare_at),
    currency: "ILS",
    condition: p.condition,
    availability: p.availability,
    images: (p.images?.length ? p.images : ["hero-office.jpg"]).map(resolveImage),
    specifications: Array.isArray(p.specifications) ? p.specifications : [],
    featured: !!p.featured,
    stock: p.stock ?? 0,
    material: p.material ?? "",
    colorways: p.colorways ?? [],
    badge: p.badge ?? undefined,
    lead: pick(p, "lead", locale),
    addedAt: (p.created_at ?? "").slice(0, 10),
  })) as Product[];

  const services: Service[] = raw.services
    .filter((s) => s.active)
    .map((s) => ({
      slug: s.slug,
      name: pick(s, "name", locale),
      summary: pick(s, "summary", locale),
      points: pickArray(s, "points", locale),
    }));

  const projects: Project[] = raw.projects
    .filter((p) => p.active)
    .map((p) => ({
      slug: p.slug,
      name: pick(p, "name", locale),
      type: p.type,
      location: pick(p, "location", locale),
      year: p.year,
      scope: pick(p, "scope", locale),
      metric: pick(p, "metric", locale),
      image: resolveImage(p.image),
    })) as Project[];

  const texts: Record<string, string> = {};
  for (const row of raw.texts) texts[row.key] = pick(row, "value", locale);

  const s = raw.settings;
  const settings: SiteSettings = s
    ? {
        name: s.name || COMPANY.name,
        tagline: s.tagline || COMPANY.tagline,
        phone: s.phone || COMPANY.phone,
        whatsapp: s.whatsapp || COMPANY.whatsapp,
        email: s.email || COMPANY.email,
        facebook: s.facebook || COMPANY.facebook,
        address: s.address || COMPANY.address,
        hours: s.hours || COMPANY.hours,
      }
    : { ...COMPANY };

  return {
    settings,
    texts,
    categories: categories.length ? categories : FALLBACK.categories,
    products: products.length ? products : FALLBACK.products,
    services: services.length ? services : FALLBACK.services,
    projects: projects.length ? projects : FALLBACK.projects,
  };
}

/* -------------------------------------------------- provider */

const CmsContext = React.createContext<CmsData>(FALLBACK);

export function CmsProvider({ children }: { children: React.ReactNode }) {
  const { locale } = useLocale();

  const { data } = useQuery({
    queryKey: CMS_QUERY_KEY,
    queryFn: fetchCmsRaw,
    staleTime: 60_000,
  });

  const value = React.useMemo(() => (data ? localize(data, locale) : FALLBACK), [data, locale]);

  return <CmsContext.Provider value={value}>{children}</CmsContext.Provider>;
}

export function useCms(): CmsData {
  return React.useContext(CmsContext);
}

/** Editable page copy, with a hardcoded fallback while content loads. */
export function useText(key: string, fallback: string): string {
  const { texts } = useCms();
  return texts[key]?.trim() ? texts[key] : fallback;
}

export function useCompany(): SiteSettings {
  return useCms().settings;
}

export function useWhatsappLink(message?: string): string {
  const { whatsapp, name } = useCompany();
  const text = message ?? `Hello ${name}, I'd like to discuss an office project.`;
  return `https://wa.me/${whatsapp}?text=${encodeURIComponent(text)}`;
}
