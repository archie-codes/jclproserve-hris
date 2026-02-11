"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createExamAction } from "@/src/actions/exam-builder";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  timeLimit: z.coerce.number().min(5, "Minimum 5 minutes"),
  passingScore: z.coerce.number().min(1).max(100, "Max 100%"),
});

export function CreateExamModal() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      timeLimit: 60,
      passingScore: 75,
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const result = await createExamAction(data);
      if (result.success && result.examId) {
        toast.success("Exam created successfully");
        setOpen(false);
        form.reset();
        // Redirect immediately to the builder page
        router.push(`/dashboard/recruitment/exams/${result.examId}`);
      } else {
        toast.error("Failed to create exam");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="shadow-md">
          <Plus className="mr-2 h-4 w-4" /> Create New Exam
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Exam</DialogTitle>
          <DialogDescription>
            Set up the basics for your new applicant test.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Exam Title</label>
            <Input placeholder="e.g. Area Coordinator Aptitude Test" {...form.register("title")} />
            {form.formState.errors.title && (
              <p className="text-red-500 text-xs">{form.formState.errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea placeholder="Short description of what this covers..." {...form.register("description")} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Time Limit (Mins)</label>
              <Input type="number" {...form.register("timeLimit")} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Passing Score (%)</label>
              <Input type="number" {...form.register("passingScore")} />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create & Add Questions
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}