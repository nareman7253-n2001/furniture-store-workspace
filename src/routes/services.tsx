import { createFileRoute } from "@tanstack/react-router";

import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { ServiceCard } from "@/components/site/cards";
import { CTASection } from "@/components/site/CTASection";
import { SectionHeading } from "@/components/site/SectionHeading";
import { services } from "@/data/catalog";
import heroImg from "@/assets/hero-office.jpg";

const process = [
  { step: "Brief", copy: "A call, a floor plan and a headcount. We agree scope and budget bands." },
  { step: "Plan", copy: "Space study, CAD layouts and a specification with three price options." },
  { step: "Deliver", copy: "Procurement, scheduled delivery and installation outside business hours." },
  { step: "Handover", copy: "Snag walk, warranty pack and an aftercare contact for five years." },
];

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Office Furnishing & Workspace Planning Services | Atelier Works" },
      {
        name: "description",
        content:
          "Complete office furnishing, workspace planning, delivery and installation, and office clearance — delivered under one contract.",
      },
      { property: "og:title", content: "Workspace Services | Atelier Works" },
      {
        property: "og:description",
        content: "Planning, furnishing, installation and clearance for commercial workspaces.",
      },
    ],
  }),
  component: Services,
});

function Services() {
  return (
    <>
      <section className="container-page pt-8 pb-16">
        <Breadcrumbs items={[{ label: "Services" }]} />
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-end">
          <div>
            <p className="eyebrow">Services</p>
            <h1 className="display-lg mt-4 text-balance">
              One team from empty floor to first working day.
            </h1>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
            We plan, supply, install and clear. Clients get a single contract, one project manager
            and a fixed handover date.
          </p>
        </div>
        <div className="media-frame mt-12 aspect-21/9 rounded-sm">
          <img src={heroImg} alt="Installed office floor" loading="lazy" />
        </div>
      </section>

      <section className="hairline-t section-y">
        <div className="container-page">
          <div className="grid gap-10 md:grid-cols-2">
            {services.map((s, i) => (
              <ServiceCard key={s.slug} service={s} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="hairline-t section-y bg-surface">
        <div className="container-page">
          <SectionHeading eyebrow="How we work" title="A four-stage process, no surprises." />
          <ol className="mt-12 grid gap-8 md:grid-cols-4">
            {process.map((p, i) => (
              <li key={p.step} className="border-t border-hairline pt-6">
                <span className="font-display text-xl text-clay tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-base font-semibold">{p.step}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.copy}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <CTASection eyebrow="Services" title="Get a specification and budget." />
    </>
  );
}
