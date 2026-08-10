/**
 * Multilingual scaffolding.
 *
 * The UI is built with logical CSS properties (ms/me, ps/pe, text-start),
 * so switching `dir` on <html> is enough to flip the whole interface.
 * Adding a locale here + a dictionary file is all future i18n work requires.
 */

export const LOCALES = ["en", "he", "ar"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_META: Record<Locale, { label: string; native: string; dir: "ltr" | "rtl" }> = {
  en: { label: "English", native: "English", dir: "ltr" },
  he: { label: "Hebrew", native: "עברית", dir: "rtl" },
  ar: { label: "Arabic", native: "العربية", dir: "rtl" },
};

export function getDirection(locale: Locale): "ltr" | "rtl" {
  return LOCALE_META[locale].dir;
}

export const CURRENCY = "ILS";

export function formatPrice(value: number, locale: Locale = DEFAULT_LOCALE) {
  return new Intl.NumberFormat(locale === "en" ? "en-US" : locale, {
    style: "currency",
    currency: CURRENCY,
    maximumFractionDigits: 0,
  }).format(value);
}
