// "use client";

// import { useState } from "react";
// import { useForm, useFieldArray } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Textarea } from "@/components/ui/textarea";
// import { Plus, Trash2, Save, Loader2 } from "lucide-react";
// import { toast } from "sonner";
// import { addQuestionAction } from "@/src/actions/exam-builder";

// const questionSchema = z.object({
//   text: z.string().min(1, "Question is required"),
//   choices: z.array(z.object({
//     text: z.string().min(1, "Choice text is required"),
//     isCorrect: z.boolean().default(false),
//   })),
// });

// export function AddQuestionForm({ examId }: { examId: string }) {
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const form = useForm({
//     resolver: zodResolver(questionSchema),
//     defaultValues: {
//       text: "",
//       choices: [
//         { text: "", isCorrect: false },
//         { text: "", isCorrect: false }, // Start with 2 empty choices
//       ],
//     },
//   });

//   const { fields, append, remove } = useFieldArray({
//     control: form.control,
//     name: "choices",
//   });

//   const onSubmit = async (data: z.infer<typeof questionSchema>) => {
//     // Validation: Ensure at least one correct answer
//     if (!data.choices.some((c) => c.isCorrect)) {
//       toast.error("Please mark at least one correct answer.");
//       return;
//     }

//     setIsSubmitting(true);
//     const result = await addQuestionAction({ ...data, examId });

//     if (result.success) {
//       toast.success("Question added successfully!");
//       form.reset({
//         text: "",
//         choices: [{ text: "", isCorrect: false }, { text: "", isCorrect: false }],
//       });
//     } else {
//       toast.error("Failed to add question.");
//     }
//     setIsSubmitting(false);
//   };

//   return (
//     <div className="border rounded-lg p-6 bg-card shadow-sm">
//       <h3 className="font-semibold mb-4 flex items-center gap-2">
//         <Plus className="h-4 w-4" /> Add New Question
//       </h3>

//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//         {/* Question Text */}
//         <div className="space-y-2">
//           <label className="text-sm font-medium">Question</label>
//           <Textarea
//             {...form.register("text")}
//             placeholder="e.g. What is the standard operating procedure for..."
//           />
//           {form.formState.errors.text && (
//             <p className="text-red-500 text-xs">{form.formState.errors.text.message}</p>
//           )}
//         </div>

//         {/* Choices */}
//         <div className="space-y-3">
//           <label className="text-sm font-medium">Choices (Check the correct answer)</label>
//           {fields.map((field, index) => (
//             <div key={field.id} className="flex items-center gap-3">
//               <Checkbox
//                 checked={form.watch(`choices.${index}.isCorrect`)}
//                 onCheckedChange={(checked) =>
//                   form.setValue(`choices.${index}.isCorrect`, checked === true)
//                 }
//               />
//               <Input
//                 {...form.register(`choices.${index}.text`)}
//                 placeholder={`Option ${index + 1}`}
//               />
//               {fields.length > 2 && (
//                 <Button
//                   type="button"
//                   variant="ghost"
//                   size="icon"
//                   onClick={() => remove(index)}
//                   className="text-red-500 hover:bg-red-50"
//                 >
//                   <Trash2 className="h-4 w-4" />
//                 </Button>
//               )}
//             </div>
//           ))}

//           <Button
//             type="button"
//             variant="outline"
//             size="sm"
//             onClick={() => append({ text: "", isCorrect: false })}
//             className="mt-2"
//           >
//             <Plus className="h-3 w-3 mr-2" /> Add Option
//           </Button>
//         </div>

//         <div className="pt-4 flex justify-end">
//           <Button type="submit" disabled={isSubmitting}>
//             {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
//             Save & Add Next
//           </Button>
//         </div>
//       </form>
//     </div>
//   );
// }
"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { addQuestionAction } from "@/src/actions/exam-builder";
import { ImageUploadField } from "./upload-button";
import { Switch } from "@/components/ui/switch"; // Updated import
import { Label } from "@/components/ui/label"; // Updated import

const questionSchema = z.object({
  text: z.string().min(1, "Question is required"),
  imageUrl: z.string().optional(),
  points: z.coerce.number().min(1).default(1),
  choices: z.array(
    z.object({
      text: z.string().min(1, "Choice text is required"),
      imageUrl: z.string().optional(),
      isCorrect: z.boolean().default(false),
    }),
  ),
});

export function AddQuestionForm({ examId }: { examId: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showImageUploads, setShowImageUploads] = useState(false);

  const form = useForm({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      text: "",
      imageUrl: "",
      points: 1,
      choices: [
        { text: "", imageUrl: "", isCorrect: false },
        { text: "", imageUrl: "", isCorrect: false },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "choices",
  });

  const onSubmit = async (data: z.infer<typeof questionSchema>) => {
    if (!data.choices.some((c) => c.isCorrect)) {
      toast.error("Please mark at least one correct answer.");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      ...data,
      examId,
      imageUrl: data.imageUrl || null,
      choices: data.choices.map((choice) => ({
        ...choice,
        imageUrl: choice.imageUrl || null,
      })),
    };

    const result = await addQuestionAction(payload);

    if (result.success) {
      toast.success("Question added successfully!");
      form.reset({
        text: "",
        imageUrl: "",
        points: 1,
        choices: [
          { text: "", imageUrl: "", isCorrect: false },
          { text: "", imageUrl: "", isCorrect: false },
        ],
      });
    } else {
      toast.error("Failed to add question.");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="border rounded-lg p-6 bg-card shadow-sm border-l-4 border-l-blue-600">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold flex items-center gap-2 text-blue-700">
          <Plus className="h-4 w-4" /> Add New Question
        </h3>

        {/* Toggle for Image Uploaders */}
        <div className="flex items-center space-x-2 bg-slate-100 p-2 rounded-lg border">
          <Switch
            id="image-mode"
            checked={showImageUploads}
            onCheckedChange={setShowImageUploads}
          />
          <Label
            htmlFor="image-mode"
            className="text-[10px] uppercase font-bold text-slate-500 cursor-pointer"
          >
            Images
          </Label>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Question Text */}
        <div className="space-y-2">
          <label className="text-sm font-semibold">Question Text</label>
          <Textarea
            {...form.register("text")}
            placeholder="e.g. Aling pigura ang bumubuo sa serye?"
            className="min-h-[80px]"
          />
          {form.formState.errors.text && (
            <p className="text-red-500 text-xs">
              {form.formState.errors.text.message}
            </p>
          )}
        </div>

        {/* Conditional Question Image */}
        {showImageUploads && (
          <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
            <label className="text-sm font-semibold flex items-center gap-2">
              <ImageIcon className="h-3 w-3" /> Question Image
            </label>
            <ImageUploadField
              currentValue={form.watch("imageUrl")}
              onUploadSuccess={(url) => form.setValue("imageUrl", url)}
            />
          </div>
        )}

        {/* Points */}
        <div className="space-y-2">
          <label className="text-sm font-semibold flex items-center gap-2">
            <Hash className="h-3 w-3" /> Points
          </label>
          <Input type="number" {...form.register("points")} />
        </div>

        {/* Choices Section */}
        <div className="space-y-4 pt-4 border-t">
          <label className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
            Choices (Mark the correct answer)
          </label>

          <div className="space-y-3">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="p-4 rounded-lg bg-slate-50 border space-y-3 relative group"
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    className="mt-3"
                    checked={form.watch(`choices.${index}.isCorrect`)}
                    onCheckedChange={(checked) =>
                      form.setValue(
                        `choices.${index}.isCorrect`,
                        checked === true,
                      )
                    }
                  />
                  <div className="flex-1 space-y-3">
                    <Input
                      {...form.register(`choices.${index}.text`)}
                      placeholder={`Choice ${index + 1}`}
                      className="bg-white"
                    />

                    {/* Conditional Choice Image */}
                    {showImageUploads && (
                      <div className="animate-in fade-in slide-in-from-top-1">
                        <ImageUploadField
                          currentValue={form.watch(`choices.${index}.imageUrl`)}
                          onUploadSuccess={(url) =>
                            form.setValue(`choices.${index}.imageUrl`, url)
                          }
                          className="max-w-[150px]"
                        />
                      </div>
                    )}
                  </div>

                  {fields.length > 2 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                      className="text-red-500 hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
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
            onClick={() => append({ text: "", imageUrl: "", isCorrect: false })}
            className="w-full border-dashed"
          >
            <Plus className="h-4 w-4 mr-2" /> Add Option
          </Button>
        </div>

        <div className="pt-6 flex justify-end gap-3 border-t">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="min-w-[150px]"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Question
          </Button>
        </div>
      </form>
    </div>
  );
}
