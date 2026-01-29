import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function RootPage() {
  const session = (await cookies()).get("session")?.value;

  // If already logged in, go to dashboard
  if (session) {
    redirect("/dashboard");
  }

  // Otherwise, go to the new login page
  redirect("/login");
}