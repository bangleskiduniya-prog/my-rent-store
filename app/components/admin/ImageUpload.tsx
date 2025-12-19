"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { X, Upload, Image as ImageIcon } from "lucide-react";
import { Spinner } from "@/components/ui/Spinner";

interface ImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxFiles?: number;
}

export function ImageUpload({ images, onChange, maxFiles = 5 }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploading(true);
    const newImages: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "My-rent-store");
        formData.append("cloud_name", "dec141lqk");

        const res = await fetch(
          "https://api.cloudinary.com/v1_1/dec141lqk/image/upload",
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await res.json();
        if (data.secure_url) {
          newImages.push(data.secure_url);
        } else {
            console.error("Cloudinary upload failed", data);
        }
      }

      onChange([...images, ...newImages]);
    } catch (error) {
      console.error("Error uploading images:", error);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (url: string) => {
    onChange(images.filter((image) => image !== url));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {images.map((url) => (
          <div key={url} className="relative aspect-square rounded-md overflow-hidden border bg-gray-100 group">
            <img
              src={url}
              alt="Uploaded"
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={() => removeImage(url)}
              className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <label className="cursor-pointer">
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
            disabled={uploading || images.length >= maxFiles}
          />
          <Button
            type="button"
            variant="secondary"
            disabled={uploading || images.length >= maxFiles}
            className="pointer-events-none"
          >
             {uploading ? <Spinner className="mr-2 h-4 w-4" /> : <Upload className="mr-2 h-4 w-4" />}
            Upload Images
          </Button>
        </label>
        <span className="text-xs text-gray-500">
          {images.length} / {maxFiles} images
        </span>
      </div>
    </div>
  );
}
