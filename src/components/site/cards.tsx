import * as React from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { primaryImage, type Category, type Product, type Project, type Service } from "@/data/catalog";

/* -------------------------------------------------- product */

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();

  return (
    <article className="group flex h-full flex-col">
      <Link
        to="/shop/$slug"
        params={{ slug: product.slug }}
        className="media-frame relative block aspect-4/5 rounded-sm"
        aria-label={product.name}
      >
        <img
          src={primaryImage(product)}
          alt={product.name}
          loading="lazy"
          className="transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute top-3 start-3 flex flex-wrap gap-2">
          <Badge variant={product.condition === "New" ? "clay" : "outline"}>
            {product.condition}
          </Badge>
          <Badge variant="outline">{product.availability}</Badge>
        </div>
      </Link>

      <button
        type="button"
        onClick={() => add(product)}
        aria-label={`Add ${product.name} to cart`}
        className="pointer-events-none absolute grid size-10 place-items-center opacity-0"
        tabIndex={-1}
      >
        <Plus className="size-4" />
      </button>

      <div className="mt-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold">
            <Link to="/shop/$slug" params={{ slug: product.slug }} className="hover:text-clay">
              {product.name}
            </Link>
          </h3>
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {product.description}
          </p>
        </div>
        <div className="shrink-0 text-end">
          <p className="text-sm font-semibold tabular-nums">{formatPrice(product.price)}</p>
          {product.compareAt ? (
            <p className="text-xs text-muted-foreground line-through tabular-nums">
              {formatPrice(product.compareAt)}
            </p>
          ) : null}
        </div>
      </div>

      <p className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
        <span
          aria-hidden
          className={cn(
            "size-1.5 rounded-full",
            product.availability === "In stock" ? "bg-clay" : "bg-muted-foreground/50",
          )}
        />
        {product.availability} · {product.lead}
      </p>

      <div className="mt-4 flex items-center gap-4">
        <Button size="sm" variant="outline" onClick={() => add(product)}>
          Add to cart
        </Button>
        <Link
          to="/shop/$slug"
          params={{ slug: product.slug }}
          className="link-underline text-xs text-muted-foreground hover:text-foreground"
        >
          View details
        </Link>
      </div>
    </article>
  );
}

/* -------------------------------------------------- category */

export function CategoryCard({
  category,
  className,
  size = "default",
}: {
  category: Category;
  className?: string;
  size?: "default" | "tall";
}) {
  return (
    <Link
      to="/shop"
      search={{ category: category.slug }}
      className={cn("group relative block", className)}
    >
      <div
        className={cn(
          "media-frame rounded-sm",
          size === "tall" ? "aspect-3/4 md:aspect-2/3" : "aspect-4/3",
        )}
      >
        <img src={category.image} alt={category.name} loading="lazy" className="group-hover:scale-[1.04]" />
      </div>
      <div className="mt-4 flex items-baseline justify-between gap-4">
        <h3 className="text-sm font-semibold">{category.name}</h3>
        <span className="text-xs text-muted-foreground tabular-nums">{category.count}</span>
      </div>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{category.description}</p>
    </Link>
  );
}

/* -------------------------------------------------- project */

export function ProjectCard({ project, featured = false }: { project: Project; featured?: boolean }) {
  return (
    <article className={cn("group", featured && "md:col-span-2")}>
      <div className={cn("media-frame rounded-sm", featured ? "aspect-16/9" : "aspect-4/3")}>
        <img src={project.image} alt={project.name} loading="lazy" className="group-hover:scale-[1.03]" />
      </div>
      <div className="mt-5 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
        <div className="min-w-0">
          <p className="eyebrow">{project.type}</p>
          <h3 className="mt-2 font-display text-2xl leading-tight">{project.name}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{project.scope}</p>
        </div>
        <div className="shrink-0 text-end text-xs text-muted-foreground">
          <p>{project.location}</p>
          <p className="mt-1 tabular-nums">{project.year}</p>
          <p className="mt-1 text-foreground">{project.metric}</p>
        </div>
      </div>
    </article>
  );
}

/* -------------------------------------------------- service */

export function ServiceCard({ service, index }: { service: Service; index: number }) {
  return (
    <article className="group flex h-full flex-col border-t border-hairline pt-6">
      <div className="flex items-baseline gap-4">
        <span className="font-display text-xl text-clay tabular-nums">
          {String(index + 1).padStart(2, "0")}
        </span>
        <h3 className="text-lg font-semibold tracking-tight">{service.name}</h3>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{service.summary}</p>
      <ul className="mt-6 space-y-2">
        {service.points.map((point) => (
          <li key={point} className="flex items-center gap-3 text-xs text-foreground">
            <span className="h-px w-4 bg-clay" aria-hidden />
            {point}
          </li>
        ))}
      </ul>
      <Link
        to="/contact"
        className="link-underline mt-8 text-xs font-semibold uppercase tracking-[0.12em]"
      >
        Request this service
        <ArrowRight className="size-3.5 rtl:rotate-180" />
      </Link>
    </article>
  );
}
