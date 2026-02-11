"use server";

import { db } from "@/src/db";
import { applicantResults } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function deleteApplicantResult(resultId: string) {
  try {
    await db.delete(applicantResults).where(eq(applicantResults.id, resultId));
    revalidatePath("/dashboard/recruitment/results");
    return { success: true };
  } catch (error) {
    console.error("Delete Result Error:", error);
    return { success: false, error: "Failed to delete result record." };
  }
}