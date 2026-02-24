// "use server";

// import { db } from "@/src/db";
// import { exams, questions, questionChoices } from "@/src/db/schema";
// import { eq } from "drizzle-orm";
// import { revalidatePath } from "next/cache";
// import { z } from "zod";

// // --- 1. CREATE EXAM CONTAINER ---
// const createExamSchema = z.object({
//   title: z.string().min(1, "Title is required"),
//   description: z.string().optional(),
//   passingScore: z.coerce.number().min(1).max(100),
//   timeLimit: z.coerce.number().min(5),
// });

// export async function createExamAction(data: z.infer<typeof createExamSchema>) {
//   try {
//     const [newExam] = await db.insert(exams).values({
//       title: data.title,
//       description: data.description,
//       passingScore: data.passingScore,
//       timeLimit: data.timeLimit,
//     }).returning({ id: exams.id });

//     revalidatePath("/dashboard/recruitment/exams");
//     return { success: true, examId: newExam.id };
//   } catch (error) {
//     return { success: false, error: "Failed to create exam" };
//   }
// }

// // --- 2. ADD QUESTION WITH CHOICES ---
// const addQuestionSchema = z.object({
//   examId: z.string(),
//   text: z.string().min(1, "Question text required"),
//   choices: z.array(z.object({
//     text: z.string().min(1),
//     isCorrect: z.boolean()
//   })).min(2, "Need at least 2 choices"),
// });

// export async function addQuestionAction(data: z.infer<typeof addQuestionSchema>) {
//   try {
//     // A. Insert Question
//     const [q] = await db.insert(questions).values({
//       examId: data.examId,
//       text: data.text,
//     }).returning({ id: questions.id });

//     // B. Insert Choices
//     await db.insert(questionChoices).values(
//       data.choices.map((choice) => ({
//         questionId: q.id,
//         text: choice.text,
//         isCorrect: choice.isCorrect,
//       }))
//     );

//     revalidatePath(`/dashboard/recruitment/exams/${data.examId}`);
//     return { success: true };
//   } catch (error) {
//     console.error("Add Question Error:", error);
//     return { success: false, error: "Failed to add question" };
//   }
// }

// // 1. DELETE EXAM
// export async function deleteExam(examId: string) {
//   try {
//     // Note: This might fail if there are already Applicant Results linked to this exam
//     // (Foreign Key Constraint). Realistically, you should only delete empty exams.
//     await db.delete(exams).where(eq(exams.id, examId));

//     revalidatePath("/dashboard/recruitment/exams");
//     return { success: true };
//   } catch (error) {
//     console.error("Delete Exam Error:", error);
//     return {
//       success: false,
//       error: "Cannot delete this exam. It may have applicant results attached. Try archiving it instead."
//     };
//   }
// }

// // 2. TOGGLE ACTIVE STATUS (Archive/Unarchive)
// export async function toggleExamStatus(examId: string, currentStatus: boolean) {
//   try {
//     await db.update(exams)
//       .set({ isActive: !currentStatus })
//       .where(eq(exams.id, examId));

//     revalidatePath("/dashboard/recruitment/exams");
//     return { success: true };
//   } catch (error) {
//     return { success: false, error: "Failed to update status" };
//   }
// }

"use server";

import { db } from "@/src/db";
import { exams, questions, questionChoices } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// --- 1. CREATE EXAM CONTAINER ---
const createExamSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  passingScore: z.coerce.number().min(1).max(100),
  timeLimit: z.coerce.number().min(5),
});

export async function createExamAction(data: z.infer<typeof createExamSchema>) {
  try {
    const [newExam] = await db
      .insert(exams)
      .values({
        title: data.title,
        description: data.description,
        passingScore: data.passingScore,
        timeLimit: data.timeLimit,
      })
      .returning({ id: exams.id });

    revalidatePath("/dashboard/recruitment/exams");
    return { success: true, examId: newExam.id };
  } catch (error) {
    return { success: false, error: "Failed to create exam" };
  }
}

// --- 2. ADD QUESTION WITH CHOICES (Updated for Images & Points) ---
const addQuestionSchema = z.object({
  examId: z.string(),
  text: z.string().min(1, "Question text required"),
  imageUrl: z.string().nullable().optional(),
  points: z.number().min(1).default(1),
  choices: z
    .array(
      z.object({
        text: z.string().min(1),
        imageUrl: z.string().nullable().optional(),
        isCorrect: z.boolean(),
      }),
    )
    .min(2, "Need at least 2 choices"),
});

export async function addQuestionAction(
  data: z.infer<typeof addQuestionSchema>,
) {
  try {
    // 1. Insert Question First
    const [q] = await db
      .insert(questions)
      .values({
        examId: data.examId,
        text: data.text,
        imageUrl: data.imageUrl,
        points: data.points,
      })
      .returning({ id: questions.id });

    // 2. Insert Choices immediately after
    // Note: Since we don't have transactions here, if this fails,
    // you might end up with a question that has no choices.
    await db.insert(questionChoices).values(
      data.choices.map((choice) => ({
        questionId: q.id,
        text: choice.text,
        imageUrl: choice.imageUrl,
        isCorrect: choice.isCorrect,
      })),
    );

    revalidatePath(`/dashboard/recruitment/exams/${data.examId}`);
    return { success: true };
  } catch (error) {
    console.error("Add Question Error:", error);
    return { success: false, error: "Failed to add question" };
  }
}

// --- 3. DELETE EXAM ---
export async function deleteExam(examId: string) {
  try {
    await db.delete(exams).where(eq(exams.id, examId));

    revalidatePath("/dashboard/recruitment/exams");
    return { success: true };
  } catch (error) {
    console.error("Delete Exam Error:", error);
    return {
      success: false,
      error:
        "Cannot delete this exam. It may have applicant results attached. Try archiving it instead.",
    };
  }
}

// --- 4. TOGGLE ACTIVE STATUS ---
export async function toggleExamStatus(examId: string, currentStatus: boolean) {
  try {
    await db
      .update(exams)
      .set({ isActive: !currentStatus })
      .where(eq(exams.id, examId));

    revalidatePath("/dashboard/recruitment/exams");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to update status" };
  }
}

// --- 5. DELETE QUESTION ---
export async function deleteQuestionAction(questionId: string, examId: string) {
  try {
    // This will delete the question.
    // Because you used onDelete: "cascade" in your schema, all choices attached to this question will be automatically deleted too!
    await db.delete(questions).where(eq(questions.id, questionId));

    // Refresh the specific exam page so the question disappears instantly
    revalidatePath(`/dashboard/recruitment/exams/${examId}`);
    return { success: true };
  } catch (error) {
    console.error("Delete Question Error:", error);
    return { success: false, error: "Failed to delete question" };
  }
}
