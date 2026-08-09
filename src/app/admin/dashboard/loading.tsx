import { Loader2 } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="flex h-[60vh] w-full items-center justify-center">
      <Loader2 className="w-12 h-12 animate-spin text-indigo-500" />
    </div>
  );
}
