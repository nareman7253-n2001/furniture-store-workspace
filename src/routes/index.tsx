import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, MessageCircle } from "lucide-react";

import heroImg from "@/assets/hero-office.jpg";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/site/SectionHeading";
import { CategoryCard, ProductCard, ProjectCard, ServiceCard } from "@/components/site/cards";
import { CTASection } from "@/components/site/CTASection";
import { categories, products, projects, services, stats } from "@/data/catalog";
import { whatsappLink } from "@/lib/company";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Atelier Works — Office Furniture & Workspace Solutions" },
      {
        name: "description",
        content:
          "Premium office desks, chairs, executive and reception furniture, plus complete office furnishing, workspace planning and installation.",
      },
      { property: "og:title", content: "Atelier Works — Office Furniture & Workspace Solutions" },
      {
        property: "og:description",
        content:
          "Furniture and complete workspace solutions for corporate offices, executive suites, receptions and meeting rooms.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative">
        <div className="container-page grid gap-10 pt-12 pb-16 lg:grid-cols-[1fr_1.15fr] lg:items-end lg:gap-16 lg:pt-16 lg:pb-24">
          <div>
            <p className="eyebrow">Office furniture · Workspace solutions</p>
            <h1 className="display-xl mt-6 text-balance">
              Workspaces built
              <span className="block italic text-clay">to be worked in.</span>
            </h1>
            <p className="mt-8 max-w-md text-base leading-relaxed text-muted-foreground">
              We supply and install office furniture — and furnish entire floors. From a single
              desk to a 200-person headquarters, delivered under one contract.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/shop">
                  Shop the catalogue
                  <ArrowRight className="size-4 rtl:rotate-180" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href={whatsappLink()} target="_blank" rel="noreferrer">
                  <MessageCircle className="size-4" />
                  WhatsApp a consultant
                </a>
              </Button>
            </div>
          </div>

          <div className="media-frame aspect-4/3 rounded-sm lg:aspect-16/10">
            <img
              src={heroImg}
              alt="Modern open-plan office with oak desks and black steel framing"
              width={1920}
              height={1200}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div className="container-page">
          <dl className="hairline-t hairline-b grid grid-cols-2 divide-border md:grid-cols-4 md:divide-x">
            {stats.map((s) => (
              <div key={s.label} className="px-1 py-6 md:px-6 md:first:ps-0">
                <dt className="font-display text-4xl leading-none">{s.value}</dt>
                <dd className="mt-2 text-xs text-muted-foreground">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Categories */}
      <section className="section-y">
        <div className="container-page">
          <SectionHeading
            eyebrow="Catalogue"
            title="Eight collections, one specification standard."
            description="Every piece is contract-grade, warrantied and available with delivery and installation."
            action={
              <Button asChild variant="link" size="link" className="text-xs uppercase tracking-[0.12em]">
                <Link to="/shop">
                  View all categories
                  <ArrowRight className="size-3.5 rtl:rotate-180" />
                </Link>
              </Button>
            }
          />
          <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 lg:grid-cols-4">
            {categories.map((c) => (
              <CategoryCard key={c.slug} category={c} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="hairline-t section-y bg-surface">
        <div className="container-page">
          <SectionHeading
            eyebrow="Selected pieces"
            title="This season's most specified."
            action={
              <Button asChild variant="outline" size="sm">
                <Link to="/shop">All products</Link>
              </Button>
            }
          />
          <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {products.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section-y">
        <div className="container-page">
          <SectionHeading
            eyebrow="Services"
            title="Furniture is the easy part."
            description="Planning, logistics, installation and clearance handled by one team with one point of contact."
          />
          <div className="mt-12 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            {services.map((s, i) => (
              <ServiceCard key={s.slug} service={s} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="hairline-t section-y">
        <div className="container-page">
          <SectionHeading
            eyebrow="Selected projects"
            title="Recently delivered."
            action={
              <Button asChild variant="outline" size="sm">
                <Link to="/projects">All projects</Link>
              </Button>
            }
          />
          <div className="mt-12 grid gap-x-8 gap-y-14 md:grid-cols-2">
            {projects.slice(0, 2).map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
