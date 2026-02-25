"use client";

import { Printer } from "lucide-react";

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md font-medium shadow-sm transition-colors flex items-center gap-2"
    >
      <Printer className="h-4 w-4" />
      Print to PDF / Printer
    </button>
  );
}
