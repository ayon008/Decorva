"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

type GalleryItem = { id: string; url: string; name: string; file?: File };

const ProductGallery = ({
  setGalleryImages,
  defaultImageUrls = [],
}: {
  setGalleryImages: (files: File[]) => void;
  defaultImageUrls?: { id: string; url: string }[];
}) => {
  const makeId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  const galleryInputRef = useRef<HTMLInputElement>(null);
  const objectUrlsRef = useRef<string[]>([]);
  const hasSyncedDefaultRef = useRef(false);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);

  // Show default images when product loads (edit mode). Batched to satisfy React Compiler.
  useEffect(() => {
    if (!defaultImageUrls?.length || hasSyncedDefaultRef.current) return;
    hasSyncedDefaultRef.current = true;
    const items: GalleryItem[] = defaultImageUrls.map((img, idx) => ({
      id: img.id,
      url: img.url,
      name: `Image ${idx + 1}`,
    }));
    queueMicrotask(() => setGalleryItems(items));
  }, [defaultImageUrls]);

  // Notify parent of new files only (default URLs have no File)
  useEffect(() => {
    const files = galleryItems.filter((i): i is GalleryItem & { file: File } => !!i.file).map((i) => i.file);
    setGalleryImages(files);
  }, [galleryItems, setGalleryImages]);

  useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      objectUrlsRef.current = [];
    };
  }, []);

  return (
    <div className="bg-white p-3 flex flex-col gap-2 border border-black/30">
      <div className="text-base border-b border-b-black/30 pb-2">Product Gallery</div>

      <div className="flex flex-col gap-2">
        <button
          type="button"
          className="text-xs text-primary cursor-pointer w-fit hover:underline text-left"
          onClick={() => galleryInputRef.current?.click()}
        >
          Add product gallery images
        </button>

        <input
          ref={galleryInputRef}
          type="file"
          name="product-image"
          id="product-image"
          aria-label="Product gallery images"
          className="hidden"
          accept="image/*"
          multiple
          onChange={(e) => {
            const files = Array.from(e.target.files ?? []);
            if (!files.length) {
              e.currentTarget.value = "";
              return;
            }

            const newItems: GalleryItem[] = files.map((f) => {
              const url = URL.createObjectURL(f);
              objectUrlsRef.current.push(url);
              return { id: makeId(), url, name: f.name, file: f };
            });

            setGalleryItems((prev) => [...prev, ...newItems]);

            e.currentTarget.value = "";
          }}
        />

        {galleryItems.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {galleryItems.map((item, idx) => (
              <div key={item.id} className="relative w-[50px] h-[50px]">
                {item.url.startsWith("blob:") || item.url.startsWith("/") ? (
                  <Image
                    src={item.url}
                    alt={item.name ? `Gallery image: ${item.name}` : `Gallery image ${idx + 1}`}
                    width={50}
                    height={50}
                    unoptimized
                    className="w-[50px] h-[50px] object-cover border border-black/30 rounded-sm aspect-square"
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element -- external URLs (edit mode)
                  <img
                    src={item.url}
                    alt={item.name ? `Gallery image: ${item.name}` : `Gallery image ${idx + 1}`}
                    className="w-[50px] h-[50px] object-cover border border-black/30 rounded-sm aspect-square"
                  />
                )}
                <button
                  type="button"
                  className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-white border border-black/30 text-[10px] leading-none flex items-center justify-center hover:bg-black/5"
                  aria-label="Remove image"
                  onClick={() => {
                    if (item.file) {
                      URL.revokeObjectURL(item.url);
                      objectUrlsRef.current = objectUrlsRef.current.filter((u) => u !== item.url);
                    }
                    setGalleryItems((prev) => prev.filter((x) => x.id !== item.id));
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {galleryItems.length > 0 && (
          <button
            type="button"
            className="text-xs text-red-600 hover:underline w-fit"
            onClick={() => {
              objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
              objectUrlsRef.current = [];
              hasSyncedDefaultRef.current = false;
              setGalleryItems([]);
              setGalleryImages([]);
              if (galleryInputRef.current) galleryInputRef.current.value = "";
            }}
          >
            Clear gallery
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductGallery;

