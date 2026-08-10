import { Link } from "@tanstack/react-router";
import { ArrowRight, MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { COMPANY, whatsappLink } from "@/lib/company";

export function CTASection({
  eyebrow = "Start a project",
  title = "Tell us about your space.",
  description = "Share a floor plan, a headcount or a rough idea. We'll come back within one working day with a specification and an indicative budget.",
}: {
  eyebrow?: string;
  title?: string;
  description?: string;
}) {
  return (
    <section className="bg-primary text-primary-foreground">
      <div className="container-page section-y">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <div>
            <p className="eyebrow text-primary-foreground/60">{eyebrow}</p>
            <h2 className="display-lg mt-4 text-balance">{title}</h2>
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-primary-foreground/70">
              {description}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
            <Button asChild variant="clay" size="lg">
              <a href={whatsappLink()} target="_blank" rel="noreferrer">
                <MessageCircle className="size-4" />
                WhatsApp us
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground hover:text-primary"
            >
              <Link to="/contact">
                Book a consultation
                <ArrowRight className="size-4 rtl:rotate-180" />
              </Link>
            </Button>
          </div>
        </div>
        <p className="mt-10 text-xs text-primary-foreground/50">
          {COMPANY.phone} · {COMPANY.email} · {COMPANY.hours}
        </p>
      </div>
    </section>
  );
}
