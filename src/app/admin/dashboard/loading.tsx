import { Loader2 } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
      <Loader2 className="w-12 h-12 animate-spin text-slate-900" />
      <p className="text-slate-500 font-medium tracking-wide animate-pulse">Loading data...</p>
    </div>
  );
}
