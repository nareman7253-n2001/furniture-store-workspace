import { COMPANY } from "@/lib/company";
import { createFileRoute } from "@tanstack/react-router";

import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { CTASection } from "@/components/site/CTASection";
import { SectionHeading } from "@/components/site/SectionHeading";
import { stats } from "@/data/catalog";
import receptionImg from "@/assets/project-reception.jpg";
import meetingImg from "@/assets/project-meeting.jpg";

const values = [
  {
    title: "Contract-grade only",
    copy: "Everything we sell is rated for commercial use and carries a minimum five-year warranty.",
  },
  {
    title: "One point of contact",
    copy: "A single project manager from specification through to snag-free handover.",
  },
  {
    title: "Responsible clearance",
    copy: "Existing furniture is resold, donated or recycled — with a diversion report for your ESG file.",
  },
];

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: `About the Studio | ${COMPANY.name} Office Furniture` },
      {
        name: "description",
        content:
          `${COMPANY.name} is an office furniture and workspace solutions studio furnishing commercial interiors for eighteen years.`,
      },
      { property: "og:title", content: `About ${COMPANY.name}` },
      {
        property: "og:description",
        content: "An office furniture and workspace solutions studio for commercial interiors.",
      },
    ],
  }),
  component: About,
});

function About() {
  return (
    <>
      <section className="container-page pt-8 pb-16">
        <Breadcrumbs items={[{ label: "About" }]} />
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-end">
          <div>
            <p className="eyebrow">The studio</p>
            <h1 className="display-lg mt-4 text-balance">
              Eighteen years of furnishing places people work.
            </h1>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
            We started as a two-person installation crew. Today we specify, supply and install for
            architects, facilities teams and founders across the West Coast.
          </p>
        </div>
      </section>

      <section className="container-page">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="media-frame aspect-4/3 rounded-sm">
            <img src={receptionImg} alt="Reception project" loading="lazy" />
          </div>
          <div className="media-frame aspect-4/3 rounded-sm md:mt-16">
            <img src={meetingImg} alt="Meeting room project" loading="lazy" />
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="container-page">
          <SectionHeading eyebrow="How we operate" title="Three commitments we don't negotiate." />
          <div className="mt-12 grid gap-10 md:grid-cols-3">
            {values.map((v) => (
              <div key={v.title} className="border-t border-hairline pt-6">
                <h3 className="text-base font-semibold">{v.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{v.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="hairline-t hairline-b bg-surface">
        <div className="container-page">
          <dl className="grid grid-cols-2 md:grid-cols-4 md:divide-x md:divide-border">
            {stats.map((s) => (
              <div key={s.label} className="px-1 py-10 md:px-8 md:first:ps-0">
                <dt className="font-display text-4xl leading-none">{s.value}</dt>
                <dd className="mt-2 text-xs text-muted-foreground">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <CTASection eyebrow="Work with us" title="Let's plan your next workspace." />
    </>
  );
}
