import Link from "next/link";
import { db } from "@/src/db";

export default async function UsersPage() {
  const users = await db.query.users.findMany({
    columns: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Users</h1>

        <Link
          href="/dashboard/users/new"
          className="rounded-md bg-primary px-4 py-2 text-primary-foreground"
        >
          + New User
        </Link>
      </div>

      <div className="rounded-md border">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b">
                <td className="p-3">{user.name}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">{user.role}</td>
                <td className="p-3 text-right">
                  {/* ✅ THIS IS THE IMPORTANT PART */}
                  <Link
                    href={`/dashboard/users/${user.id}/edit`}
                    className="text-primary hover:underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
