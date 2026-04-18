"use client";

import { useState } from "react";
// 👇 Changed from UploadDropzone to UploadButton for instant 1-click auto-upload
import { UploadButton } from "@/lib/uploadthing";
import { toast } from "sonner";
import { saveEmployeeIdCards } from "@/src/actions/employees";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Loader2, Save, AlertCircle } from "lucide-react";

export function IdUploader({
  employeeId,
  initialFrontUrl,
  initialBackUrl,
}: {
  employeeId: string;
  initialFrontUrl?: string | null;
  initialBackUrl?: string | null;
}) {
  const [frontUrl, setFrontUrl] = useState(initialFrontUrl || "");
  const [backUrl, setBackUrl] = useState(initialBackUrl || "");

  // Track states for loading and saving
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingFront, setIsUploadingFront] = useState(false);
  const [isUploadingBack, setIsUploadingBack] = useState(false);

  // UX Logic: Check if the current images are NEW (staged but not saved)
  const isFrontStaged = frontUrl !== (initialFrontUrl || "") && frontUrl !== "";
  const isBackStaged = backUrl !== (initialBackUrl || "") && backUrl !== "";

  const hasChanges = isFrontStaged || isBackStaged;
  const isReadyToSave = frontUrl !== "" && backUrl !== "" && hasChanges;
  const isCurrentlyUploading = isUploadingFront || isUploadingBack;

  const handleSave = async () => {
    setIsSaving(true);
    const result = await saveEmployeeIdCards(employeeId, frontUrl, backUrl);

    if (result.success) {
      toast.success("ID Cards saved successfully!");
    } else {
      toast.error(result.error || "Failed to save URL to database.");
    }

    setIsSaving(false);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ================= FRONT ID ================= */}
        <div className="border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center text-center bg-slate-50 relative min-h-[220px]">
          <h4 className="text-sm font-semibold mb-4 z-10 bg-white/90 px-3 py-1 rounded-full shadow-sm absolute top-4">
            Front of ID
          </h4>

          {frontUrl ? (
            <div className="relative w-full h-48 rounded-lg overflow-hidden border shadow-sm mt-8">
              <Image
                src={frontUrl}
                alt="Front ID"
                fill
                className="object-cover"
              />

              {/* STAGED BADGE (Shows when ready to save) */}
              {isFrontStaged && (
                <div className="absolute top-2 left-2 bg-amber-500 text-white text-[10px] px-2.5 py-1 rounded-full font-bold shadow-md animate-pulse flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  READY TO SAVE
                </div>
              )}

              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute bottom-2 right-2 opacity-80 hover:opacity-100 shadow-md"
                onClick={() => setFrontUrl("")}
              >
                Replace
              </Button>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center mt-8">
              <UploadButton
                endpoint="employeeImage"
                onUploadBegin={() => setIsUploadingFront(true)} // Starts the loading bar lock
                onClientUploadComplete={(res) => {
                  setIsUploadingFront(false);
                  if (res && res[0]) {
                    setFrontUrl(res[0].url);
                    toast.success(
                      "Front ID uploaded! Don't forget to click Save.",
                    );
                  }
                }}
                onUploadError={(error) => {
                  setIsUploadingFront(false);
                  toast.error(`Upload failed: ${error.message}`);
                }}
                appearance={{
                  // Custom styling makes the button look like a big dropzone!
                  button:
                    "w-full h-24 bg-indigo-50 hover:bg-indigo-100 border-2 border-dashed border-indigo-200 !text-indigo-500 font-semibold rounded-xl text-sm transition-all focus-within:ring-2 focus-within:ring-indigo-500",
                  allowedContent: "hidden", // Hides the "Images up to 4MB" text for a cleaner look
                }}
                content={{
                  button({ ready, isUploading }) {
                    if (isUploading) return "Uploading..."; // Automatic Loading text + bar
                    if (ready) return "Select Picture";
                    return "Getting ready...";
                  },
                }}
              />
            </div>
          )}
        </div>

        {/* ================= BACK ID ================= */}
        <div className="border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center text-center bg-slate-50 relative min-h-[220px]">
          <h4 className="text-sm font-semibold mb-4 z-10 bg-white/90 px-3 py-1 rounded-full shadow-sm absolute top-4">
            Back of ID
          </h4>

          {backUrl ? (
            <div className="relative w-full h-48 rounded-lg overflow-hidden border shadow-sm mt-8">
              <Image
                src={backUrl}
                alt="Back ID"
                fill
                className="object-cover"
              />

              {/* STAGED BADGE (Shows when ready to save) */}
              {isBackStaged && (
                <div className="absolute top-2 left-2 bg-amber-500 text-white text-[10px] px-2.5 py-1 rounded-full font-bold shadow-md animate-pulse flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  READY TO SAVE
                </div>
              )}

              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute bottom-2 right-2 opacity-80 hover:opacity-100 shadow-md"
                onClick={() => setBackUrl("")}
              >
                Replace
              </Button>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center mt-8">
              <UploadButton
                endpoint="employeeImage"
                onUploadBegin={() => setIsUploadingBack(true)} // Starts the loading bar lock
                onClientUploadComplete={(res) => {
                  setIsUploadingBack(false);
                  if (res && res[0]) {
                    setBackUrl(res[0].url);
                    toast.success(
                      "Back ID uploaded! Don't forget to click Save.",
                    );
                  }
                }}
                onUploadError={(error) => {
                  setIsUploadingBack(false);
                  toast.error(`Upload failed: ${error.message}`);
                }}
                appearance={{
                  button:
                    "w-full h-24 bg-indigo-50 hover:bg-indigo-100 border-2 border-dashed border-indigo-200 !text-indigo-500 font-semibold rounded-xl text-sm transition-all focus-within:ring-2 focus-within:ring-indigo-500",
                  allowedContent: "hidden",
                }}
                content={{
                  button({ ready, isUploading }) {
                    if (isUploading) return "Uploading..."; // Automatic Loading text + bar
                    if (ready) return "Select Picture";
                    return "Getting ready...";
                  },
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* ================= SAVE BUTTON FOOTER ================= */}
      <div className="flex flex-col items-center gap-4 pt-4 border-t mt-4 text-center">
        <div className="text-sm text-muted-foreground">
          {isCurrentlyUploading ? (
            <span className="flex items-center text-indigo-600 font-medium">
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading
              image...
            </span>
          ) : hasChanges && isReadyToSave ? (
            <span className="text-amber-600 font-medium">
              Unsaved changes detected. Click save to confirm.
            </span>
          ) : frontUrl === "" || backUrl === "" ? (
            <span>Both sides of the ID must be uploaded before saving.</span>
          ) : (
            <span className="text-emerald-600 font-medium">
              All ID images are up to date.
            </span>
          )}
        </div>
        <Button
          type="button"
          onClick={handleSave}
          disabled={!isReadyToSave || isSaving || isCurrentlyUploading}
          className="min-w-[140px] shadow-sm"
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save ID Cards
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
