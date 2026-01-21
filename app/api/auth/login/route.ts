import { NextResponse } from "next/server";
import { authenticateUser } from "@/src/queries/auth";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
  }

  const user = await authenticateUser(email, password);

  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });

  response.cookies.set("session", JSON.stringify(user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  return response;
}
