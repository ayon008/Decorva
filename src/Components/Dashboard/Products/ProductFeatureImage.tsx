"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

const ProductFeatureImage = ({
  setFeaturedImage,
  defaultImageUrl = null,
}: {
  setFeaturedImage: (file: File) => void;
  defaultImageUrl?: string | null;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef<string | null>(null);
  const hasUserSelectedFileRef = useRef(false);

  const [featurePreviewUrl, setFeaturePreviewUrl] = useState<string | null>(null);
  const [featureFileName, setFeatureFileName] = useState<string | null>(null);

  // Show default image when product loads (edit mode)
  useEffect(() => {
    if (!defaultImageUrl) return;
    if (hasUserSelectedFileRef.current) return;
    setFeaturePreviewUrl(defaultImageUrl);
    setFeatureFileName(null);
  }, [defaultImageUrl]);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
        previewUrlRef.current = null;
      }
    };
  }, []);

  return (
    <div className="bg-white p-3 flex flex-col gap-2 border border-black/30">
      <label
        htmlFor="product-feature-image"
        className="text-base border-b border-b-black/30 pb-2"
      >
        Product feature image
      </label>

      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          name="product-feature-image"
          id="product-feature-image"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0] ?? null;

            if (previewUrlRef.current) {
              URL.revokeObjectURL(previewUrlRef.current);
              previewUrlRef.current = null;
            }

            if (!file) {
              setFeaturePreviewUrl(defaultImageUrl ?? null);
              setFeatureFileName(null);
              hasUserSelectedFileRef.current = false;
              e.currentTarget.value = "";
              return;
            }
            hasUserSelectedFileRef.current = true;
            setFeaturedImage(file);
            const url = URL.createObjectURL(file);
            previewUrlRef.current = url;
            setFeaturePreviewUrl(url);
            setFeatureFileName(file.name);

            // allow re-selecting the same file later
            e.currentTarget.value = "";
          }}
        />

        {featurePreviewUrl ? (
          <div className="w-full mt-1">
            {featurePreviewUrl.startsWith("blob:") || featurePreviewUrl.startsWith("/") ? (
              <Image
                src={featurePreviewUrl}
                alt={
                  featureFileName
                    ? `Product feature preview: ${featureFileName}`
                    : "Product feature preview"
                }
                width={1200}
                height={400}
                unoptimized
                className="w-full h-auto aspect-square object-cover border border-black/30 rounded-sm"
              />
            ) : (
              <img
                src={featurePreviewUrl}
                alt={featureFileName ? `Product feature preview: ${featureFileName}` : "Product feature preview"}
                className="w-full h-auto aspect-square object-cover border border-black/30 rounded-sm"
              />
            )}
            <div className="flex items-center justify-between mt-2">
              <button
                type="button"
                className="text-xs text-primary hover:underline cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                Replace Product Image
              </button>
              <button
                type="button"
                className="text-xs text-red-600 hover:underline cursor-pointer"
                onClick={() => {
                  if (previewUrlRef.current) {
                    URL.revokeObjectURL(previewUrlRef.current);
                    previewUrlRef.current = null;
                  }
                  hasUserSelectedFileRef.current = false;
                  setFeaturePreviewUrl(defaultImageUrl ?? null);
                  setFeatureFileName(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            className="text-xs text-primary hover:underline"
            onClick={() => fileInputRef.current?.click()}
          >
            Set Product Image
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductFeatureImage;

