import { db } from "@/src/db";
import UsersPageClient from "@/components/dashboard/users/users-page-client";
import { getCurrentUser } from "@/lib/auth";

export default async function UsersPage() {
  const users = await db.query.users.findMany();
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    // Safety fallback (middleware should already handle this)
    return null;
  }

  const safeCurrentUser = {
  id: currentUser.id,
  name: currentUser.name,
  email: currentUser.email,
  role: (currentUser.role ?? "HR") as "ADMIN" | "HR",
  isActive: currentUser.isActive ?? true,
};

  const normalizedUsers = users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role ?? "HR",
    isActive: u.isActive ?? true,
    image: u.image,
  }));

  return (
<UsersPageClient
  users={normalizedUsers}
  currentUser={safeCurrentUser}
/>

  );
}
