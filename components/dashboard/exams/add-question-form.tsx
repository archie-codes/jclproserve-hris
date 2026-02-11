"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { addQuestionAction } from "@/src/actions/exam-builder";

const questionSchema = z.object({
  text: z.string().min(1, "Question is required"),
  choices: z.array(z.object({
    text: z.string().min(1, "Choice text is required"),
    isCorrect: z.boolean().default(false),
  })),
});

export function AddQuestionForm({ examId }: { examId: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      text: "",
      choices: [
        { text: "", isCorrect: false },
        { text: "", isCorrect: false }, // Start with 2 empty choices
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "choices",
  });

  const onSubmit = async (data: z.infer<typeof questionSchema>) => {
    // Validation: Ensure at least one correct answer
    if (!data.choices.some((c) => c.isCorrect)) {
      toast.error("Please mark at least one correct answer.");
      return;
    }

    setIsSubmitting(true);
    const result = await addQuestionAction({ ...data, examId });
    
    if (result.success) {
      toast.success("Question added successfully!");
      form.reset({
        text: "",
        choices: [{ text: "", isCorrect: false }, { text: "", isCorrect: false }],
      });
    } else {
      toast.error("Failed to add question.");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="border rounded-lg p-6 bg-card shadow-sm">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <Plus className="h-4 w-4" /> Add New Question
      </h3>
      
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Question Text */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Question</label>
          <Textarea 
            {...form.register("text")} 
            placeholder="e.g. What is the standard operating procedure for..." 
          />
          {form.formState.errors.text && (
            <p className="text-red-500 text-xs">{form.formState.errors.text.message}</p>
          )}
        </div>

        {/* Choices */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Choices (Check the correct answer)</label>
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-3">
              <Checkbox 
                checked={form.watch(`choices.${index}.isCorrect`)}
                onCheckedChange={(checked) => 
                  form.setValue(`choices.${index}.isCorrect`, checked === true)
                }
              />
              <Input 
                {...form.register(`choices.${index}.text`)} 
                placeholder={`Option ${index + 1}`} 
              />
              {fields.length > 2 && (
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => remove(index)}
                  className="text-red-500 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ text: "", isCorrect: false })}
            className="mt-2"
          >
            <Plus className="h-3 w-3 mr-2" /> Add Option
          </Button>
        </div>

        <div className="pt-4 flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
            Save & Add Next
          </Button>
        </div>
      </form>
    </div>
  );
}