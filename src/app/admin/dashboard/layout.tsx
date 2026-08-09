import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Settings, Truck, Image as ImageIcon, LayoutDashboard } from "lucide-react";
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
    <div className="flex h-screen bg-slate-900 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] text-slate-100 font-sans selection:bg-indigo-500/30 relative overflow-hidden">
      
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900/40 backdrop-blur-2xl border-r border-white/10 hidden md:flex flex-col z-20 shadow-2xl">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <span className="text-white font-medium tracking-widest uppercase">Admin</span>
        </div>
        <nav className="flex-1 p-4 space-y-2 font-medium text-sm">
          <Link href="/admin/dashboard" className="flex items-center space-x-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-white/5  transition-all border border-transparent hover:border-white/10">
            <LayoutDashboard size={20} strokeWidth={1.5} />
            <span>Dashboard</span>
          </Link>
          <Link href="/admin/dashboard/deliveries" className="flex items-center space-x-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-white/5  transition-all border border-transparent hover:border-white/10">
            <Truck size={20} strokeWidth={1.5} />
            <span>Deliveries</span>
          </Link>
          <Link href="/admin/dashboard/gallery" className="flex items-center space-x-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-white/5  transition-all border border-transparent hover:border-white/10">
            <ImageIcon size={20} strokeWidth={1.5} />
            <span>Gallery</span>
          </Link>
          <Link href="/admin/dashboard/settings" className="flex items-center space-x-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-white/5  transition-all border border-transparent hover:border-white/10">
            <Settings size={20} strokeWidth={1.5} />
            <span>Settings</span>
          </Link>
        </nav>
        <div className="p-6 pt-4">
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <div className="h-16 border-b border-white/10 bg-slate-900/50 backdrop-blur-xl flex items-center justify-between px-4 z-20 sticky top-0 md:hidden">
          <span className="text-white font-medium tracking-widest uppercase">Admin</span>
          <LogoutButton compact />
        </div>
        
        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6 md:p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
