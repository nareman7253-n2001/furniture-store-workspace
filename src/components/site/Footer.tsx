import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCms, useCompany } from "@/lib/cms";
import { LOCALES, LOCALE_META, useLocale } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function Footer() {
  const company = useCompany();
  const { categories, services } = useCms();
  const { locale, setLocale, t } = useLocale();

  return (
    <footer className="hairline-t bg-surface">
      <div className="container-page py-16 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="max-w-sm">
            <p className="font-display text-3xl leading-tight">{company.name}</p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{company.tagline}</p>
            <form
              className="mt-8"
              onSubmit={(e) => {
                e.preventDefault();
                toast.success("Thanks — you're on the list.", {
                  description: "We send one considered email each quarter.",
                });
                (e.currentTarget as HTMLFormElement).reset();
              }}
            >
              <label htmlFor="newsletter" className="eyebrow">
                Trade newsletter
              </label>
              <div className="mt-3 flex gap-2">
                <Input id="newsletter" type="email" required placeholder="you@company.com" />
                <Button type="submit" size="icon" aria-label="Subscribe">
                  <ArrowRight className="size-4 rtl:rotate-180" />
                </Button>
              </div>
            </form>
          </div>

          <nav aria-label={t("nav.shop")}>
            <p className="eyebrow">{t("nav.shop")}</p>
            <ul className="mt-5 space-y-3">
              {categories.slice(0, 6).map((c) => (
                <li key={c.slug}>
                  <Link
                    to="/shop"
                    search={{ category: c.slug }}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={t("nav.services")}>
            <p className="eyebrow">{t("nav.services")}</p>
            <ul className="mt-5 space-y-3">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link
                    to="/services"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {s.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/projects"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {t("nav.projects")}
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {t("nav.about")}
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <p className="eyebrow">{t("nav.contact")}</p>
            <address className="mt-5 space-y-3 text-sm not-italic text-muted-foreground">
              <p>{company.address}</p>
              <p>
                <a
                  href={`tel:${company.phone.replace(/\s/g, "")}`}
                  className="hover:text-foreground"
                >
                  {company.phone}
                </a>
              </p>
              <p>
                <a href={`mailto:${company.email}`} className="hover:text-foreground">
                  {company.email}
                </a>
              </p>
              {company.facebook ? (
                <p>
                  <a
                    href={company.facebook}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-foreground"
                  >
                    Facebook
                  </a>
                </p>
              ) : null}
              <p>{company.hours}</p>
            </address>
          </div>
        </div>

        <div className="hairline-t mt-14 flex flex-col gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {company.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground">{t("lang.label")}</span>
            <div className="flex items-center gap-1">
              {LOCALES.map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLocale(l)}
                  aria-pressed={locale === l}
                  className={cn(
                    "cursor-pointer border px-2 py-1 text-xs transition-colors",
                    locale === l
                      ? "border-foreground text-foreground"
                      : "border-transparent text-muted-foreground hover:border-hairline hover:text-foreground",
                  )}
                >
                  {LOCALE_META[l].native}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="container-page pb-6 text-xs text-muted-foreground">
        <Link to="/admin" className="hover:text-foreground">
          {t("nav.admin")}
        </Link>
      </div>
    </footer>
  );
}
