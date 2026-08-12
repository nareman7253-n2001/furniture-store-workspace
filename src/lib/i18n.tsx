import * as React from "react";

/**
 * Multilingual layer.
 *
 * The UI is built with logical CSS properties (ms/me, ps/pe, text-start),
 * so switching `dir` on <html> flips the whole interface.
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

/* -------------------------------------------------- UI dictionary */

type Dict = Record<string, string>;

const en: Dict = {
  "nav.home": "Home",
  "nav.shop": "Shop",
  "nav.services": "Services",
  "nav.projects": "Projects",
  "nav.about": "About",
  "nav.contact": "Contact",
  "nav.admin": "Control panel",
  "action.search": "Search",
  "action.whatsapp": "WhatsApp",
  "action.addToCart": "Add to cart",
  "action.viewDetails": "View details",
  "action.requestQuote": "Request a quote",
  "action.requestService": "Request this service",
  "action.browseShop": "Browse the catalogue",
  "action.bookConsultation": "Book a consultation",
  "action.signIn": "Sign in",
  "action.signOut": "Sign out",
  "action.save": "Save",
  "action.add": "Add",
  "action.delete": "Delete",
  "cart.title": "Your cart",
  "cart.empty": "Your cart is empty.",
  "cart.subtotal": "Subtotal",
  "cart.note": "Delivery and installation are quoted per project.",
  "shop.searchPlaceholder": "Search desks, chairs, storage…",
  "shop.categories": "Shop by category",
  "shop.filters": "Filters",
  "shop.sort": "Sort",
  "shop.empty": "No products match your filters.",
  "shop.condition": "Condition",
  "shop.availability": "Availability",
  "shop.price": "Price",
  "shop.all": "All",
  "menu.title": "Menu",
  "lang.label": "Language",
};

const he: Dict = {
  "nav.home": "בית",
  "nav.shop": "חנות",
  "nav.services": "שירותים",
  "nav.projects": "פרויקטים",
  "nav.about": "אודות",
  "nav.contact": "צור קשר",
  "nav.admin": "לוח ניהול",
  "action.search": "חיפוש",
  "action.whatsapp": "וואטסאפ",
  "action.addToCart": "הוספה לסל",
  "action.viewDetails": "לפרטים",
  "action.requestQuote": "בקשת הצעת מחיר",
  "action.requestService": "לבקש שירות זה",
  "action.browseShop": "לעיון בקטלוג",
  "action.bookConsultation": "לקביעת ייעוץ",
  "action.signIn": "התחברות",
  "action.signOut": "התנתקות",
  "action.save": "שמירה",
  "action.add": "הוספה",
  "action.delete": "מחיקה",
  "cart.title": "הסל שלך",
  "cart.empty": "הסל ריק.",
  "cart.subtotal": "סה\u05f4כ",
  "cart.note": "משלוח והתקנה מתומחרים לפי פרויקט.",
  "shop.searchPlaceholder": "חיפוש שולחנות, כיסאות, אחסון…",
  "shop.categories": "קנייה לפי קטגוריה",
  "shop.filters": "סינון",
  "shop.sort": "מיון",
  "shop.empty": "לא נמצאו מוצרים מתאימים.",
  "shop.condition": "מצב",
  "shop.availability": "זמינות",
  "shop.price": "מחיר",
  "shop.all": "הכל",
  "menu.title": "תפריט",
  "lang.label": "שפה",
};

const ar: Dict = {
  "nav.home": "الرئيسية",
  "nav.shop": "المتجر",
  "nav.services": "الخدمات",
  "nav.projects": "المشاريع",
  "nav.about": "من نحن",
  "nav.contact": "اتصل بنا",
  "nav.admin": "لوحة التحكم",
  "action.search": "بحث",
  "action.whatsapp": "واتساب",
  "action.addToCart": "أضف إلى السلة",
  "action.viewDetails": "التفاصيل",
  "action.requestQuote": "طلب عرض سعر",
  "action.requestService": "اطلب هذه الخدمة",
  "action.browseShop": "تصفح الكتالوج",
  "action.bookConsultation": "احجز استشارة",
  "action.signIn": "تسجيل الدخول",
  "action.signOut": "تسجيل الخروج",
  "action.save": "حفظ",
  "action.add": "إضافة",
  "action.delete": "حذف",
  "cart.title": "سلتك",
  "cart.empty": "السلة فارغة.",
  "cart.subtotal": "المجموع",
  "cart.note": "التوصيل والتركيب يُسعَّران حسب المشروع.",
  "shop.searchPlaceholder": "ابحث عن مكاتب، كراسي، تخزين…",
  "shop.categories": "تسوق حسب الفئة",
  "shop.filters": "تصفية",
  "shop.sort": "ترتيب",
  "shop.empty": "لا توجد منتجات مطابقة.",
  "shop.condition": "الحالة",
  "shop.availability": "التوفر",
  "shop.price": "السعر",
  "shop.all": "الكل",
  "menu.title": "القائمة",
  "lang.label": "اللغة",
};

const DICTS: Record<Locale, Dict> = { en, he, ar };

/* -------------------------------------------------- provider */

interface LocaleContextValue {
  locale: Locale;
  dir: "ltr" | "rtl";
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  price: (value: number) => string;
}

const LocaleContext = React.createContext<LocaleContextValue | null>(null);

const STORAGE_KEY = "locale";

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = React.useState<Locale>(DEFAULT_LOCALE);

  React.useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (stored && (LOCALES as readonly string[]).includes(stored)) setLocaleState(stored);
  }, []);

  React.useEffect(() => {
    const root = document.documentElement;
    root.lang = locale;
    root.dir = getDirection(locale);
  }, [locale]);

  const setLocale = React.useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const value = React.useMemo<LocaleContextValue>(
    () => ({
      locale,
      dir: getDirection(locale),
      setLocale,
      t: (key: string) => DICTS[locale][key] ?? DICTS.en[key] ?? key,
      price: (value: number) => formatPrice(value, locale),
    }),
    [locale, setLocale],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const ctx = React.useContext(LocaleContext);
  if (!ctx) {
    return {
      locale: DEFAULT_LOCALE,
      dir: "ltr",
      setLocale: () => {},
      t: (key: string) => DICTS.en[key] ?? key,
      price: (value: number) => formatPrice(value),
    };
  }
  return ctx;
}
