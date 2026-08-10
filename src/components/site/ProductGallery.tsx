import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Reusable product gallery: large frame + thumbnail rail.
 * Used by product detail views and quick-view modals.
 */
export function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const [index, setIndex] = React.useState(0);
  const total = images.length;
  const current = images[index] ?? images[0];

  if (!current) return null;

  return (
    <div className="flex flex-col gap-4">
      <div className="media-frame relative aspect-4/5 rounded-sm md:aspect-4/3">
        <img src={current} alt={alt} loading="lazy" />
        {total > 1 ? (
          <div className="absolute bottom-3 end-3 flex gap-2">
            <button
              type="button"
              aria-label="Previous image"
              onClick={() => setIndex((i) => (i - 1 + total) % total)}
              className="grid size-9 cursor-pointer place-items-center rounded-full bg-background/90 hover:bg-background"
            >
              <ChevronLeft className="size-4 rtl:rotate-180" />
            </button>
            <button
              type="button"
              aria-label="Next image"
              onClick={() => setIndex((i) => (i + 1) % total)}
              className="grid size-9 cursor-pointer place-items-center rounded-full bg-background/90 hover:bg-background"
            >
              <ChevronRight className="size-4 rtl:rotate-180" />
            </button>
          </div>
        ) : null}
      </div>

      {total > 1 ? (
        <div className="flex gap-3">
          {images.map((image, i) => (
            <button
              key={`${image}-${i}`}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`View image ${i + 1}`}
              className={cn(
                "media-frame aspect-square w-20 cursor-pointer rounded-xs transition-opacity",
                i === index ? "border-foreground" : "opacity-60 hover:opacity-100",
              )}
            >
              <img src={image} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
