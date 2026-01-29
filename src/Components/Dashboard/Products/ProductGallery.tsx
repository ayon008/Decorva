"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

type GalleryItem = { id: string; url: string; name: string; file: File };

const ProductGallery = ({ setGalleryImages }: { setGalleryImages: (files: File[]) => void }) => {
  const makeId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  const galleryInputRef = useRef<HTMLInputElement>(null);
  const galleryItemsRef = useRef<{ url: string }[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);

  useEffect(() => {
    return () => {
      if (galleryItemsRef.current.length) {
        galleryItemsRef.current.forEach((u) => URL.revokeObjectURL(u.url));
        galleryItemsRef.current = [];
      }
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
              return { id: makeId(), url, name: f.name, file: f };
            });

            galleryItemsRef.current = [...galleryItemsRef.current, ...newItems];
            setGalleryItems((prev) => {
              const next = [...prev, ...newItems];
              setGalleryImages(next.map((item) => item.file));
              return next;
            });

            // allow selecting the same file(s) again
            e.currentTarget.value = "";
          }}
        />

        {galleryItems.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {galleryItems.map((item, idx) => (
              <div key={item.id} className="relative w-[50px] h-[50px]">
                <Image
                  src={item.url}
                  alt={item.name ? `Gallery image: ${item.name}` : `Gallery image ${idx + 1}`}
                  width={50}
                  height={50}
                  unoptimized
                  className="w-[50px] h-[50px] object-cover border border-black/30 rounded-sm aspect-square"
                />
                <button
                  type="button"
                  className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-white border border-black/30 text-[10px] leading-none flex items-center justify-center hover:bg-black/5"
                  aria-label="Remove image"
                  onClick={() => {
                    URL.revokeObjectURL(item.url);
                    galleryItemsRef.current = galleryItemsRef.current.filter((u) => u.url !== item.url);
                    setGalleryItems((prev) => {
                      const next = prev.filter((x) => x.id !== item.id);
                      setGalleryImages(next.map((i) => i.file));
                      return next;
                    });
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
              galleryItemsRef.current.forEach((u) => URL.revokeObjectURL(u.url));
              galleryItemsRef.current = [];
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

