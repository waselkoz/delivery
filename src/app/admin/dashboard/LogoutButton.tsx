"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function LogoutButton({ compact = false }: { compact?: boolean }) {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin");
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center space-x-3 w-full px-4 py-3 text-red-600 dark:text-red-400  hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
    >
      <LogOut size={20} />
      {!compact && <span>Sign Out</span>}
    </button>
  );
}
