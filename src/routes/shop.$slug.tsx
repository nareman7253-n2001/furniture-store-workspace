import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { ProductCard } from "@/components/site/cards";
import { CTASection } from "@/components/site/CTASection";
import { ProductGallery } from "@/components/site/ProductGallery";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getCategory, getProductBySlug, relatedProducts } from "@/lib/catalog";
import type { Product } from "@/data/catalog";
import { COMPANY } from "@/lib/company";
import { localizeProduct, useCms, useCompany, useWhatsappLink } from "@/lib/cms";
import { getPublicProduct } from "@/lib/product.functions";
import { useCart } from "@/lib/cart";
import { useLocale } from "@/lib/i18n";

export const Route = createFileRoute("/shop/$slug")({
  loader: async ({ params }) => {
    const row = await getPublicProduct({ data: { slug: params.slug } });
    if (!row) {
      // fall back to the bundled catalogue while the database is being populated
      const staticProduct = getProductBySlug(params.slug);
      if (!staticProduct) throw notFound();
      return { seo: { name: staticProduct.name, description: staticProduct.description }, row: null };
    }
    return {
      seo: { name: row.name_en || row.slug, description: row.description_en },
      row,
    };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Product not found" }, { name: "robots", content: "noindex" }] };
    }
    const { seo } = loaderData;
    const title = `${seo.name} — Office Furniture | ${COMPANY.name}`;
    return {
      meta: [
        { title },
        { name: "description", content: seo.description },
        { property: "og:title", content: title },
        { property: "og:description", content: seo.description },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  errorComponent: ({ error }) => (
    <div className="container-page py-24 text-center" role="alert">
      <p className="font-display text-2xl">{error.message}</p>
    </div>
  ),
  notFoundComponent: () => (
    <div className="container-page py-24 text-center">
      <p className="font-display text-2xl">Product not found</p>
      <p className="mt-3 text-sm text-muted-foreground">
        This piece may have been retired from the catalogue.
      </p>
      <Button variant="outline" size="sm" className="mt-6" asChild>
        <Link to="/shop">Back to the shop</Link>
      </Button>
    </div>
  ),
  component: ProductDetail,
});

function ProductDetail() {
  const { slug } = Route.useParams();
  const { row } = Route.useLoaderData();
  const { products, categories } = useCms();
  const { add } = useCart();
  const { locale, price: formatPrice, t } = useLocale();
  const company = useCompany();

  const product: Product | undefined =
    products.find((p) => p.slug === slug) ??
    (row ? localizeProduct(row, locale) : getProductBySlug(slug));

  const whatsapp = useWhatsappLink(
    product ? `Hello ${company.name}, I'd like a quote for the ${product.name}.` : undefined,
  );

  if (!product) {
    return (
      <div className="container-page py-24 text-center">
        <p className="font-display text-2xl">Product not found</p>
        <Button variant="outline" size="sm" className="mt-6" asChild>
          <Link to="/shop">Back to the shop</Link>
        </Button>
      </div>
    );
  }

  const category = getCategory(product.category, categories);
  const related = relatedProducts(product, 3, products);

  return (
    <>
      <section className="container-page pt-8 pb-16">
        <Breadcrumbs
          items={[
            { label: t("nav.shop"), to: "/shop" },
            ...(category ? [{ label: category.name }] : []),
            { label: product.name },
          ]}
        />

        <div className="mt-8 grid gap-12 lg:grid-cols-2 lg:gap-16">
          <ProductGallery images={product.images} alt={product.name} />

          <div className="lg:pt-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant={product.condition === "New" ? "clay" : "outline"}>
                {product.condition}
              </Badge>
              <Badge variant="outline">{product.availability}</Badge>
              {category ? <Badge variant="outline">{category.name}</Badge> : null}
            </div>

            <h1 className="display-md mt-5">{product.name}</h1>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{product.details}</p>

            <div className="mt-8 flex items-baseline gap-4">
              <p className="font-display text-3xl tabular-nums">{formatPrice(product.price)}</p>
              {product.compareAt ? (
                <p className="text-sm text-muted-foreground line-through tabular-nums">
                  {formatPrice(product.compareAt)}
                </p>
              ) : null}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {product.availability} · {product.lead}
              {product.stock > 0 ? ` · ${product.stock} in stock` : ""}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Button onClick={() => add(product)}>{t("action.addToCart")}</Button>
              <Button variant="outline" asChild>
                <a href={whatsapp} target="_blank" rel="noreferrer">
                  {t("action.requestQuote")}
                </a>
              </Button>
            </div>

            <dl className="hairline-t mt-10 grid gap-x-8 gap-y-4 pt-8 sm:grid-cols-2">
              {product.specifications.map((spec) => (
                <div key={spec.label}>
                  <dt className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                    {spec.label}
                  </dt>
                  <dd className="mt-1 text-sm">{spec.value}</dd>
                </div>
              ))}
              {product.colorways.length ? (
                <div>
                  <dt className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                    Finishes
                  </dt>
                  <dd className="mt-1 text-sm">{product.colorways.join(", ")}</dd>
                </div>
              ) : null}
              {product.material ? (
                <div>
                  <dt className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                    Material
                  </dt>
                  <dd className="mt-1 text-sm">{product.material}</dd>
                </div>
              ) : null}
            </dl>
          </div>
        </div>
      </section>

      <section className="hairline-t py-16">
        <div className="container-page">
          <div className="flex items-end justify-between gap-6">
            <p className="eyebrow">You may also like</p>
            <Link to="/shop" className="link-underline text-xs">
              View all products
              <ArrowRight className="size-3.5 rtl:rotate-180" />
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-12 sm:gap-x-6 lg:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      <CTASection eyebrow="Project enquiry" title="Furnishing a whole office?" />
    </>
  );
}
