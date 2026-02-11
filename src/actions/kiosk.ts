"use server";

import { db } from "@/src/db";
import { applicantResults, questions, questionChoices } from "@/src/db/schema";
import { eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";

type KioskSubmission = {
  examId: string;
  applicant: {
    firstName: string;
    lastName: string;
    position: string;
  };
  answers: Record<string, string>; // { questionId: choiceId }
};

export async function submitExam(data: KioskSubmission) {
  try {
    // 1. Fetch the correct answers for this exam
    // We get all choices that are marked 'isCorrect' for the questions answered
    const questionIds = Object.keys(data.answers);
    
    if (questionIds.length === 0) {
        return { success: false, error: "No answers submitted" };
    }

    const correctChoices = await db.select().from(questionChoices).where(
        inArray(questionChoices.questionId, questionIds)
    );

    // 2. Grade the Exam
    let score = 0;
    const totalPoints = questionIds.length; // Assuming 1 point per question for simplicity

    questionIds.forEach((qId) => {
      const userChoiceId = data.answers[qId];
      // Find the correct option for this question
      const correctOption = correctChoices.find(
          (c) => c.questionId === qId && c.isCorrect
      );
      
      // If user's choice matches the correct option ID
      if (correctOption && correctOption.id === userChoiceId) {
        score++;
      }
    });

    const percentage = Math.round((score / totalPoints) * 100);
    const status = percentage >= 70 ? "PASSED" : "FAILED"; // Default 70% passing

    // 3. Save Result
    await db.insert(applicantResults).values({
      examId: data.examId,
      firstName: data.applicant.firstName,
      lastName: data.applicant.lastName,
      positionApplied: data.applicant.position,
      score: score,
      totalPoints: totalPoints,
      percentage: percentage,
      status: status,
    });

    revalidatePath("/dashboard/recruitment");
    return { success: true };

  } catch (error) {
    console.error("Grading Error:", error);
    return { success: false, error: "Failed to submit exam." };
  }
}