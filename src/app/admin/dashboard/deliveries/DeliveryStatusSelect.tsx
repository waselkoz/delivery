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
        className="px-3 py-1.5 text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 hover:border-emerald-500/30 transition-all disabled:opacity-50"
      >
        Complete
      </button>
      <button 
        onClick={() => handleStatusChange("Cancelled")} 
        disabled={isPending}
        className="px-3 py-1.5 text-xs font-medium text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/30 transition-all disabled:opacity-50"
      >
        Cancel
      </button>
    </div>
  );
}
