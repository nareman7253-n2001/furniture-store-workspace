import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { COMPANY } from "@/lib/company";
import { categories, services } from "@/data/catalog";
import { LOCALES, LOCALE_META } from "@/lib/i18n";
import { toast } from "sonner";

export function Footer() {
  return (
    <footer className="hairline-t bg-surface">
      <div className="container-page py-16 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="max-w-sm">
            <p className="font-display text-3xl leading-tight">{COMPANY.name}</p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{COMPANY.tagline}</p>
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

          <nav aria-label="Shop">
            <p className="eyebrow">Shop</p>
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

          <nav aria-label="Services">
            <p className="eyebrow">Services</p>
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
                  Projects
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  About the studio
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <p className="eyebrow">Studio</p>
            <address className="mt-5 space-y-3 text-sm not-italic text-muted-foreground">
              <p>{COMPANY.address}</p>
              <p>
                <a href={`tel:${COMPANY.phone.replace(/\s/g, "")}`} className="hover:text-foreground">
                  {COMPANY.phone}
                </a>
              </p>
              <p>
                <a href={`mailto:${COMPANY.email}`} className="hover:text-foreground">
                  {COMPANY.email}
                </a>
              </p>
              <p>
                <a
                  href={COMPANY.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-foreground"
                >
                  Facebook
                </a>
              </p>
              <p>{COMPANY.hours}</p>
            </address>
          </div>
        </div>

        <div className="hairline-t mt-14 flex flex-col gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {COMPANY.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground">Language</span>
            <div className="flex items-center gap-1">
              {LOCALES.map((locale) => (
                <button
                  key={locale}
                  type="button"
                  onClick={() =>
                    toast("Multilingual support is coming", {
                      description: `${LOCALE_META[locale].native} will be enabled in phase two.`,
                    })
                  }
                  className="cursor-pointer border border-transparent px-2 py-1 text-xs text-muted-foreground transition-colors hover:border-hairline hover:text-foreground"
                >
                  {LOCALE_META[locale].native}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="container-page pb-6 text-xs text-muted-foreground">
        <Link to="/admin" className="hover:text-foreground">
          Control panel
        </Link>
      </div>
    </footer>
  );
}
