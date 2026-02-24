"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Loader2, X, ImageIcon, Trash2 } from "lucide-react";
import { useUploadThing } from "@/lib/uploadthing"; // Ensure this path matches your project
import { toast } from "sonner";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface UploadButtonProps {
  onUploadSuccess: (url: string) => void;
  currentValue?: string | null;
  className?: string;
}

export function ImageUploadField({
  onUploadSuccess,
  currentValue,
  className,
}: UploadButtonProps) {
  const [isUploading, setIsUploading] = useState(false);

  // Use the "examImage" endpoint defined in your core.ts
  const { startUpload } = useUploadThing("examImage", {
    onClientUploadComplete: (res) => {
      if (res && res[0]) {
        onUploadSuccess(res[0].url);
        toast.success("Image uploaded successfully");
      }
      setIsUploading(false);
    },
    onUploadError: (error: Error) => {
      toast.error(`Upload failed: ${error.message}`);
      setIsUploading(false);
    },
    onUploadBegin: () => {
      setIsUploading(true);
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Optional: Client-side size validation
    if (file.size > 4 * 1024 * 1024) {
      toast.error("File size must be less than 4MB");
      return;
    }

    await startUpload([file]);
  };

  return (
    <div className={cn("w-full", className)}>
      {currentValue ? (
        <div className="relative group rounded-lg border-2 border-slate-200 overflow-hidden bg-white aspect-video md:aspect-auto md:h-32">
          <Image
            src={currentValue}
            alt="Uploaded Preview"
            fill
            className="object-contain p-2"
            unoptimized
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => onUploadSuccess("")}
              className="h-8 w-8 p-0"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <label
          className={cn(
            "flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors",
            "bg-slate-50 border-slate-300 hover:bg-slate-100 hover:border-blue-400",
            isUploading && "opacity-50 cursor-not-allowed pointer-events-none",
          )}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {isUploading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <p className="text-xs font-medium text-slate-500">
                  Uploading to server...
                </p>
              </div>
            ) : (
              <>
                <div className="p-2 bg-white rounded-full shadow-sm mb-2">
                  <ImageIcon className="h-6 w-6 text-slate-400" />
                </div>
                <p className="text-sm text-slate-600">
                  <span className="font-semibold text-blue-600">
                    Click to upload
                  </span>{" "}
                  or drag and drop
                </p>
                <p className="text-xs text-slate-400">
                  PNG, JPG or WEBP (Max 4MB)
                </p>
              </>
            )}
          </div>
          <input
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept="image/*"
            disabled={isUploading}
          />
        </label>
      )}
    </div>
  );
}
