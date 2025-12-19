"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export default function ImageGallery({ images }: { images: string[] }) {
  const [selectedImage, setSelectedImage] = useState(images[0]);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square w-full rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
        No Images
      </div>
    );
  }

  return (
    <div className="flex flex-col-reverse">
      <div className="mx-auto mt-6 hidden w-full max-w-2xl sm:block lg:max-w-none">
        <div className="grid grid-cols-4 gap-6" aria-orientation="horizontal" role="tablist">
          {images.map((image) => (
            <button
              key={image}
              className={cn(
                "relative flex h-24 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring focus:ring-opacity-50 focus:ring-offset-4",
                selectedImage === image ? "ring-2 ring-black ring-offset-2" : "ring-1 ring-gray-200"
              )}
              onClick={() => setSelectedImage(image)}
            >
              <span className="sr-only">View Image</span>
              <span className="absolute inset-0 overflow-hidden rounded-md">
                <img src={image} alt="" className="h-full w-full object-cover object-center" />
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="aspect-square w-full">
        <img
          src={selectedImage}
          alt="Product Image"
          className="h-full w-full object-cover object-center sm:rounded-lg"
        />
      </div>
    </div>
  );
}
