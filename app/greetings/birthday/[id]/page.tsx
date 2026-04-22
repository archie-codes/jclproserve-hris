import { db } from "@/src/db";
import { employees } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { BirthdayClient } from "@/app/greetings/birthday/[id]/birthday-client";

export default async function BirthdayGreetingPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  const employee = await db.query.employees.findFirst({
    where: eq(employees.id, id),
  });

  if (!employee) {
    notFound();
  }

  return <BirthdayClient employee={employee} />;
}
