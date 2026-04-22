"use client";

import { LogOut } from "lucide-react";

export function LogoutButton() {
  async function handleLogout() {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    window.location.href = "/";
  }

  return (
    <button
      onClick={handleLogout}
      className="flex items-center justify-center w-full rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
    >
      <LogOut className="mr-2 h-4 w-4 text-white" />
      Logout
    </button>
  );
}
