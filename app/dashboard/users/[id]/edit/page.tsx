import { db } from "@/src/db";
import { users } from "@/src/db/schema";
import { EditUserForm } from "@/components/dashboard/edit-user-form";
import { eq } from "drizzle-orm";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditUserPage({ params }: PageProps) {
  // ✅ UNWRAP PARAMS
  const { id } = await params;

  console.log("USER ID:", id);

  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .limit(1)
    .then((res) => res[0]);

  if (!user) {
    return (
      <div className="text-red-500">
        User not found (ID: {id})
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Edit User</h1>
      <EditUserForm user={user} />
    </div>
  );
}
