"use client";

import { memo } from "react";
import { PhotoIcon } from "@heroicons/react/24/outline";
import { JsonValue } from "@/lib/section-registry";

interface GalleryItem {
  imageUrl: string;
  alt?: string;
  caption?: string;
}

interface GallerySectionProps {
  data: Record<string, JsonValue>;
}

export const GallerySection = memo(function GallerySection({ data }: GallerySectionProps) {
  const title = (data.title as string) || "معرض الأعمال";
  const items = (data.items as unknown as GalleryItem[]) || [];

  return (
    <section className="py-20 px-6 bg-background" dir="rtl">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground @md:text-4xl">{title}</h2>
          <div className="mx-auto h-1.5 w-20 rounded-full bg-accent" />
        </div>

        {items.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center rounded-3xl border border-dashed border-border-color bg-muted/60 p-8 text-center text-muted-foreground">
            <PhotoIcon className="mb-4 h-12 w-12" />
            <p className="text-sm font-semibold">أضف روابط الصور من لوحة الخصائص</p>
          </div>
        ) : (
          <div className="grid gap-5 @md:grid-cols-2 @3xl:grid-cols-3">
            {items.map((item, index) => (
              <figure
                key={`${item.imageUrl}-${index}`}
                className="group overflow-hidden rounded-3xl border border-border-color bg-muted shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.alt || item.caption || ""}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                      <PhotoIcon className="h-10 w-10" />
                    </div>
                  )}
                </div>
                {item.caption && (
                  <figcaption className="px-5 py-4 text-sm font-medium leading-7 text-foreground break-words [overflow-wrap:anywhere]">
                    {item.caption}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        )}
      </div>
    </section>
  );
});
