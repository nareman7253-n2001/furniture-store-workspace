import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  Boxes,
  ClipboardList,
  Headset,
  LayoutGrid,
  Mail,
  MessageCircle,
  Phone,
  Recycle,
  Ruler,
  ShieldCheck,
  Sparkles,
  Truck,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";

import heroImg from "@/assets/hero-office.jpg";
import completeOfficeImg from "@/assets/complete-office.jpg";
import { SectionHeading } from "@/components/site/SectionHeading";
import { CategoryCard, ProductCard, ProjectCard } from "@/components/site/cards";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { categories, products, projects, services } from "@/data/catalog";
import { COMPANY, whatsappLink } from "@/lib/company";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${COMPANY.name} — Office Furniture & Complete Workspace Solutions` },
      {
        name: "description",
        content:
          "Premium office furniture and complete workspace solutions: desks, chairs, executive and reception furniture, plus planning, delivery, installation and office clearance.",
      },
      {
        property: "og:title",
        content: `${COMPANY.name} — Office Furniture & Complete Workspace Solutions`,
      },
      {
        property: "og:description",
        content:
          "Equip your workspace with contract-grade office furniture, or let us furnish your entire office end to end.",
      },
    ],
  }),
  component: Home,
});

/* -------------------------------------------------- data (static for now; DB-ready) */

const valueStrip = [
  { icon: BadgeCheck, label: "Quality Furniture" },
  { icon: Boxes, label: "Complete Solutions" },
  { icon: Headset, label: "Professional Service" },
  { icon: Recycle, label: "New & Used Options" },
];

const featuredIds = [
  "regent-executive-desk",
  "atlas-task-chair",
  "grid-bench-workstation",
  "quarry-reception-counter",
  "assembly-conference-table",
  "stack-storage-wall",
];

const serviceIcons: Record<string, typeof Ruler> = {
  "office-furnishing": LayoutGrid,
  "workspace-planning": Ruler,
  "delivery-installation": Truck,
  "office-clearance": Recycle,
};

const serviceBlurbs: Record<string, string> = {
  "office-furnishing": "Complete furniture solutions for offices of different sizes.",
  "workspace-planning": "Practical furniture layouts designed around your space.",
  "delivery-installation": "Professional delivery and installation services.",
  "office-clearance": "Solutions for removing and replacing existing office furniture.",
};

const benefits = [
  {
    icon: ShieldCheck,
    title: "Quality & Reliability",
    body: "Furniture selected for professional work environments.",
  },
  {
    icon: Boxes,
    title: "Complete Solutions",
    body: "From individual products to complete office furnishing.",
  },
  {
    icon: Wallet,
    title: "Flexible Options",
    body: "Solutions for different spaces and budgets.",
  },
  {
    icon: ClipboardList,
    title: "Professional Service",
    body: "Support from selection through delivery and installation.",
  },
];

/* -------------------------------------------------- page */

function Home() {
  const featured = featuredIds
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is (typeof products)[number] => Boolean(p));
  const homeCategories = categories.slice(0, 6);
  const homeProjects = projects.slice(0, 3);

  return (
    <>
      <Hero />
      <ValueStrip />

      {/* ---------------- shop by category ---------------- */}
      <section className="section-y">
        <div className="container-page">
          <SectionHeading
            eyebrow="Shop by category"
            title="Find the Right Furniture for Your Workspace"
            description="Explore furniture designed for every part of your office."
            action={
              <Button asChild variant="outline" size="sm">
                <Link to="/shop">Shop all furniture</Link>
              </Button>
            }
          />

          <div className="mt-12 grid gap-x-6 gap-y-12 md:grid-cols-6">
            {homeCategories.map((category, i) => (
              <div
                key={category.slug}
                className={cn(
                  "md:col-span-3",
                  i >= 2 && "lg:col-span-2 md:col-span-3",
                )}
              >
                <CategoryCard category={category} size={i < 2 ? "default" : "default"} />
                <Link
                  to="/shop"
                  search={{ category: category.slug }}
                  className="link-underline mt-3 text-xs font-semibold uppercase tracking-[0.12em]"
                >
                  View category
                  <ArrowRight className="size-3.5 rtl:rotate-180" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- featured products ---------------- */}
      <section className="hairline-t section-y bg-surface">
        <div className="container-page">
          <SectionHeading
            eyebrow="Best sellers"
            title="Featured Furniture"
            description="Explore some of our most popular office furniture."
            action={
              <Button asChild variant="outline" size="sm">
                <Link to="/shop">View all products</Link>
              </Button>
            }
          />
          <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- complete office solutions ---------------- */}
      <section className="section-y">
        <div className="container-page grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div className="media-frame aspect-4/3 rounded-sm">
            <img
              src={completeOfficeImg}
              alt="Complete modern office furnished with bench desks, task chairs and a reception area"
              loading="lazy"
              width={1408}
              height={1008}
            />
          </div>
          <div>
            <p className="eyebrow">Complete workspace solutions</p>
            <h2 className="display-lg mt-4 text-balance">
              More Than Furniture. <span className="italic text-clay">A Complete Workspace.</span>
            </h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
              From individual furniture pieces to complete office environments, we help businesses
              create practical, professional and welcoming workspaces.
            </p>
            <div className="mt-10">
              <Button asChild size="lg">
                <Link to="/services">
                  Explore Our Services
                  <ArrowRight className="size-4 rtl:rotate-180" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- services ---------------- */}
      <section className="hairline-t section-y">
        <div className="container-page">
          <SectionHeading
            eyebrow="Services"
            title="Everything You Need to Build Your Workspace"
            description="Planning, supply, installation and clearance — handled by one team."
          />
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => {
              const Icon = serviceIcons[service.slug] ?? Sparkles;
              return (
                <article
                  key={service.slug}
                  className="flex h-full flex-col border border-hairline bg-card p-7 rounded-sm transition-shadow duration-300 hover:shadow-soft"
                >
                  <Icon className="size-6 text-clay" />
                  <h3 className="mt-6 text-base font-semibold tracking-tight">{service.name}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {serviceBlurbs[service.slug] ?? service.summary}
                  </p>
                  <Link
                    to="/services"
                    hash={service.slug}
                    className="link-underline mt-auto pt-8 text-xs font-semibold uppercase tracking-[0.12em]"
                  >
                    Learn more
                    <ArrowRight className="size-3.5 rtl:rotate-180" />
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------------- featured projects ---------------- */}
      <section className="hairline-t section-y bg-surface">
        <div className="container-page">
          <SectionHeading
            eyebrow="Featured projects"
            title="Our Work"
            description="See how we transform offices into functional and professional workspaces."
            action={
              <Button asChild variant="outline" size="sm">
                <Link to="/projects">View All Projects</Link>
              </Button>
            }
          />
          <div className="mt-12 grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
            {homeProjects.map((project) => (
              <div key={project.slug} className="flex flex-col">
                <ProjectCard project={project} />
                <Link
                  to="/projects"
                  hash={project.slug}
                  className="link-underline mt-4 text-xs font-semibold uppercase tracking-[0.12em]"
                >
                  View project
                  <ArrowRight className="size-3.5 rtl:rotate-180" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- why choose us ---------------- */}
      <section className="section-y">
        <div className="container-page">
          <SectionHeading eyebrow="Why choose us" title="Built for working offices." />
          <div className="mt-12 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="border-t border-hairline pt-6">
                <benefit.icon className="size-5 text-clay" />
                <h3 className="mt-5 text-base font-semibold tracking-tight">{benefit.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{benefit.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ProjectCTA />
      <QuickInquiry />
    </>
  );
}

/* -------------------------------------------------- sections */

function Hero() {
  return (
    <section className="relative">
      <div className="container-page grid gap-10 pt-12 pb-14 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-16 lg:pt-16 lg:pb-20">
        <div>
          <p className="eyebrow">Office Furniture &amp; Workspace Solutions</p>
          <h1 className="display-xl mt-6 text-balance">
            Equip Your Workspace.
            <span className="block italic text-clay">Elevate Your Business.</span>
          </h1>
          <p className="mt-8 max-w-md text-base leading-relaxed text-muted-foreground">
            Premium office furniture and complete workspace solutions designed for modern
            businesses.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/shop">
                Shop Furniture
                <ArrowRight className="size-4 rtl:rotate-180" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/projects">Explore Our Projects</Link>
            </Button>
          </div>
        </div>

        <div className="media-frame aspect-4/3 rounded-sm lg:aspect-16/10">
          <img
            src={heroImg}
            alt="Professionally furnished modern open-plan office with oak desks and ergonomic chairs"
            width={1920}
            height={1200}
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}

function ValueStrip() {
  return (
    <section className="hairline-t hairline-b bg-surface">
      <div className="container-page">
        <ul className="grid grid-cols-2 md:grid-cols-4 md:divide-x md:divide-border">
          {valueStrip.map((item) => (
            <li
              key={item.label}
              className="flex items-center gap-3 py-6 md:px-6 md:first:ps-0 md:last:pe-0"
            >
              <item.icon className="size-5 shrink-0 text-clay" />
              <span className="min-w-0 text-sm font-medium">{item.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function ProjectCTA() {
  return (
    <section className="bg-primary text-primary-foreground">
      <div className="container-page section-y">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <div>
            <p className="eyebrow text-primary-foreground/60">Start a project</p>
            <h2 className="display-lg mt-4 text-balance">Planning a New Office?</h2>
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-primary-foreground/70">
              Tell us about your space and let us help you create the right workspace.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
            <Button asChild variant="clay" size="lg">
              <a href={whatsappLink()} target="_blank" rel="noreferrer">
                <MessageCircle className="size-4" />
                WhatsApp Us
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground hover:text-primary"
            >
              <Link to="/contact">
                Start Your Project
                <ArrowRight className="size-4 rtl:rotate-180" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function QuickInquiry() {
  const [submitting, setSubmitting] = React.useState(false);

  return (
    <section className="section-y" id="inquiry">
      <div className="container-page grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
        <div>
          <p className="eyebrow">Quick inquiry</p>
          <h2 className="display-md mt-3 text-balance">Have a Question?</h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
            Send us a short message and a workspace consultant will reply within one working day.
          </p>

          <ul className="mt-10 space-y-4">
            <li>
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 text-sm hover:text-clay"
              >
                <MessageCircle className="size-4 shrink-0 text-clay" />
                WhatsApp — {COMPANY.phone}
              </a>
            </li>
            <li>
              <a
                href={`tel:${COMPANY.phone.replace(/[^+\d]/g, "")}`}
                className="flex items-center gap-3 text-sm hover:text-clay"
              >
                <Phone className="size-4 shrink-0 text-clay" />
                {COMPANY.phone}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${COMPANY.email}`}
                className="flex items-center gap-3 text-sm hover:text-clay"
              >
                <Mail className="size-4 shrink-0 text-clay" />
                {COMPANY.email}
              </a>
            </li>
          </ul>
          <p className="mt-6 text-xs text-muted-foreground">
            Demo contact details — replace with your live business information.
          </p>
        </div>

        <form
          className="space-y-5 border border-hairline bg-card p-7 rounded-sm"
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.currentTarget;
            setSubmitting(true);
            window.setTimeout(() => {
              setSubmitting(false);
              toast.success("Inquiry sent", {
                description: "We'll get back to you within one working day.",
              });
              form.reset();
            }, 600);
          }}
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="hi-name" className="label-caps text-muted-foreground">
                Name
              </Label>
              <Input id="hi-name" name="name" required placeholder="Dana Cohen" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hi-phone" className="label-caps text-muted-foreground">
                Phone
              </Label>
              <Input id="hi-phone" name="phone" type="tel" placeholder="+1 415 555 0142" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="hi-email" className="label-caps text-muted-foreground">
              Email
            </Label>
            <Input id="hi-email" name="email" type="email" required placeholder="you@company.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hi-message" className="label-caps text-muted-foreground">
              Message
            </Label>
            <Textarea
              id="hi-message"
              name="message"
              required
              placeholder="What are you looking to furnish?"
            />
          </div>
          <Button type="submit" size="lg" disabled={submitting} className="w-full sm:w-auto">
            {submitting ? "Sending…" : "Send Inquiry"}
          </Button>
        </form>
      </div>
    </section>
  );
}
