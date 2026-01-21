import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { CreateUserForm } from "@/components/dashboard/create-user-form";

export default async function NewUserPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-bold">Create User</h1>
      <CreateUserForm />
    </div>
  );
}
