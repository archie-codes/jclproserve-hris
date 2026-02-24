"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Trash2,
  Save,
  Loader2,
  Hash,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "sonner";
import { editQuestionAction } from "@/src/actions/exam-builder";
import { ImageUploadField } from "./upload-button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

// Same schema as add, but requires questionId
const editSchema = z.object({
  questionId: z.string(),
  examId: z.string(),
  text: z.string().min(1),
  imageUrl: z.string().optional().nullable(),
  points: z.coerce.number().min(1),
  choices: z.array(
    z.object({
      text: z.string().min(1),
      imageUrl: z.string().optional().nullable(),
      isCorrect: z.boolean(),
    }),
  ),
});

export function EditQuestionModal({
  open,
  setOpen,
  question,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  question: any;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showImageUploads, setShowImageUploads] = useState(
    !!question.imageUrl || question.choices.some((c: any) => c.imageUrl),
  );

  const form = useForm({
    resolver: zodResolver(editSchema),
    defaultValues: {
      questionId: question.id,
      examId: question.examId,
      text: question.text,
      imageUrl: question.imageUrl || "",
      points: question.points || 1,
      choices: question.choices.map((c: any) => ({
        text: c.text,
        imageUrl: c.imageUrl || "",
        isCorrect: c.isCorrect,
      })),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "choices",
  });

  const onSubmit = async (data: any) => {
    if (!data.choices.some((c: any) => c.isCorrect)) {
      toast.error("Please mark at least one correct answer.");
      return;
    }

    setIsSubmitting(true);
    const payload = {
      ...data,
      imageUrl: data.imageUrl || null,
      choices: data.choices.map((c: any) => ({
        ...c,
        imageUrl: c.imageUrl || null,
      })),
    };

    const result = await editQuestionAction(payload);

    if (result.success) {
      toast.success("Question updated!");
      setOpen(false);
    } else {
      toast.error("Failed to update question.");
    }
    setIsSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Edit Question</span>
            <div className="flex items-center space-x-2 mr-4">
              <Switch
                id="edit-img-mode"
                checked={showImageUploads}
                onCheckedChange={setShowImageUploads}
              />
              <Label htmlFor="edit-img-mode" className="text-xs">
                Images
              </Label>
            </div>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold">Question Text</label>
            <Textarea {...form.register("text")} className="min-h-[80px]" />
          </div>

          {showImageUploads && (
            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-2">
                <ImageIcon className="h-3 w-3" /> Question Image
              </label>
              <ImageUploadField
                currentValue={form.watch("imageUrl")}
                onUploadSuccess={(url) => form.setValue("imageUrl", url)}
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-semibold flex items-center gap-2">
              <Hash className="h-3 w-3" /> Points
            </label>
            <Input type="number" {...form.register("points")} />
          </div>

          <div className="space-y-4 pt-4 border-t">
            <label className="text-sm font-semibold">
              Choices (Mark correct answer)
            </label>
            <div className="space-y-3">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="p-4 rounded-lg bg-slate-50 border space-y-3"
                >
                  <div className="flex items-start gap-3">
                    <Checkbox
                      className="mt-3"
                      checked={form.watch(`choices.${index}.isCorrect`)}
                      onCheckedChange={(c) =>
                        form.setValue(`choices.${index}.isCorrect`, c === true)
                      }
                    />
                    <div className="flex-1 space-y-3">
                      <Input {...form.register(`choices.${index}.text`)} />
                      {showImageUploads && (
                        <ImageUploadField
                          currentValue={form.watch(`choices.${index}.imageUrl`)}
                          onUploadSuccess={(url) =>
                            form.setValue(`choices.${index}.imageUrl`, url)
                          }
                        />
                      )}
                    </div>
                    {fields.length > 2 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                append({ text: "", imageUrl: "", isCorrect: false })
              }
              className="w-full border-dashed"
            >
              <Plus className="h-4 w-4 mr-2" /> Add Option
            </Button>
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
