import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const cookie = (await cookies()).get("session");

  if (!cookie) redirect("/login");

  const user = JSON.parse(cookie.value);

  if (user.role !== "Admin") {
    redirect("/login");
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome {user.email}</p>
    </div>
  );
}
