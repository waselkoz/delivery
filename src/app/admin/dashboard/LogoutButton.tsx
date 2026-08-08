"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function LogoutButton({ compact = false }: { compact?: boolean }) {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/admin" })}
      className="flex items-center space-x-3 w-full px-4 py-3 text-red-600 dark:text-red-400  hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
    >
      <LogOut size={20} />
      {!compact && <span>Sign Out</span>}
    </button>
  );
}
