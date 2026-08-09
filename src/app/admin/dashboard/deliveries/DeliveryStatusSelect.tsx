"use client";

import { useTransition } from "react";
import { updateDeliveryStatus } from "./actions";

export default function DeliveryStatusSelect({ id, currentStatus }: { id: string, currentStatus: string }) {
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (newStatus: string) => {
    startTransition(() => {
      updateDeliveryStatus(id, newStatus);
    });
  };

  if (currentStatus === "Completed" || currentStatus === "Cancelled") {
    return null; // Return nothing if it's already completed or cancelled (audit log view)
  }

  return (
    <div className="flex items-center justify-end space-x-2">
      <button 
        onClick={() => handleStatusChange("Completed")} 
        disabled={isPending}
        className="px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-100 border border-emerald-200 hover:bg-emerald-200 hover:border-emerald-300 transition-all disabled:opacity-50 rounded-none uppercase tracking-widest"
      >
        Complete
      </button>
      <button 
        onClick={() => handleStatusChange("Cancelled")} 
        disabled={isPending}
        className="px-3 py-1.5 text-xs font-bold text-red-700 bg-red-100 border border-red-200 hover:bg-red-200 hover:border-red-300 transition-all disabled:opacity-50 rounded-none uppercase tracking-widest"
      >
        Cancel
      </button>
    </div>
  );
}
