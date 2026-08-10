import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Settings, Truck, Image as ImageIcon, LayoutDashboard, FileText } from "lucide-react";
import LogoutButton from "./LogoutButton";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect("/admin");
  }

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans selection:bg-slate-300 relative overflow-hidden">
      
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col z-20 shadow-sm">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between" dir="ltr">
          <span className="text-slate-900 font-bold tracking-widest uppercase">Administrateur</span>
        </div>
        <nav className="flex-1 p-4 space-y-2 font-medium text-sm" dir="ltr">
          <Link href="/admin/dashboard" className="flex items-center space-x-3 px-4 py-3 text-slate-700 hover:text-slate-900 hover:bg-gray-100 transition-all border border-transparent hover:border-gray-200 rounded-none">
            <LayoutDashboard size={20} strokeWidth={2} />
            <span className="font-bold tracking-wide">Tableau de bord</span>
          </Link>
          <Link href="/admin/dashboard/deliveries" className="flex items-center space-x-3 px-4 py-3 text-slate-700 hover:text-slate-900 hover:bg-gray-100 transition-all border border-transparent hover:border-gray-200 rounded-none">
            <Truck size={20} strokeWidth={2} />
            <span className="font-bold tracking-wide">Commandes</span>
          </Link>
          <Link href="/admin/dashboard/gallery" className="flex items-center space-x-3 px-4 py-3 text-slate-700 hover:text-slate-900 hover:bg-gray-100 transition-all border border-transparent hover:border-gray-200 rounded-none">
            <ImageIcon size={20} strokeWidth={2} />
            <span className="font-bold tracking-wide">Galerie</span>
          </Link>
          <Link href="/admin/dashboard/pages" className="flex items-center space-x-3 px-4 py-3 text-slate-700 hover:text-slate-900 hover:bg-gray-100 transition-all border border-transparent hover:border-gray-200 rounded-none">
            <FileText size={20} strokeWidth={2} />
            <span className="font-bold tracking-wide">Pages</span>
          </Link>
        </nav>
        <div className="p-6 pt-4">
          <LogoutButton />
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-4 z-20 sticky top-0 md:hidden shadow-sm" dir="ltr">
          <span className="text-slate-900 font-bold tracking-widest uppercase">Administrateur</span>
          <LogoutButton compact />
        </div>
        
        <div className="flex-1 overflow-auto p-6 md:p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
