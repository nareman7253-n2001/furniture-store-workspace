import * as React from "react";
import { COMPANY } from "@/lib/company";
import { createFileRoute } from "@tanstack/react-router";

import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { ProjectCard } from "@/components/site/cards";
import { CTASection } from "@/components/site/CTASection";
import { useCms } from "@/lib/cms";
import { useLocale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: `Office Furnishing Projects & Case Studies | ${COMPANY.name}` },
      {
        name: "description",
        content:
          `Completed corporate offices, executive suites, reception areas, meeting rooms and full workspace projects furnished by ${COMPANY.name}.`,
      },
      { property: "og:title", content: `Projects | ${COMPANY.name}` },
      {
        property: "og:description",
        content: "Selected office furnishing projects across corporate, executive and reception spaces.",
      },
    ],
  }),
  component: Projects,
});

function Projects() {
  const { projects } = useCms();
  const { t } = useLocale();
  const [filter, setFilter] = React.useState<string>("All");
  const projectTypes = Array.from(new Set(projects.map((p) => p.type))).filter(Boolean);
  const list = filter === "All" ? projects : projects.filter((p) => p.type === filter);

  return (
    <>
      <section className="container-page pt-8 pb-12">
        <Breadcrumbs items={[{ label: t("nav.projects") }]} />
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-end">
          <div>
            <p className="eyebrow">Selected work</p>
            <h1 className="display-lg mt-4 text-balance">Spaces we've furnished.</h1>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
            A sample of recent installations. Full case studies, references and floor plans are
            available on request.
          </p>
        </div>
      </section>

      <section className="hairline-t">
        <div className="container-page flex gap-2 overflow-x-auto py-5">
          {["All", ...projectTypes].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setFilter(type)}
              className={cn(
                "shrink-0 cursor-pointer whitespace-nowrap border px-4 py-2 text-xs transition-colors",
                filter === type
                  ? "border-foreground bg-primary text-primary-foreground"
                  : "border-hairline text-muted-foreground hover:border-foreground hover:text-foreground",
              )}
            >
              {type}
            </button>
          ))}
        </div>
      </section>

      <section className="hairline-t pt-14 pb-20">
        <div className="container-page">
          {list.length === 0 ? (
            <p className="py-24 text-center font-display text-2xl">
              No projects in this category yet.
            </p>
          ) : (
            <div className="grid gap-x-8 gap-y-16 md:grid-cols-2">
              {list.map((p, i) => (
                <ProjectCard key={p.slug} project={p} featured={list.length > 2 && i === 0} />
              ))}
            </div>
          )}
        </div>
      </section>

      <CTASection eyebrow="Projects" title="Your floor could be next." />
    </>
  );
}
