"use client";

import { deleteDeliveryRequest } from "./actions";
import { Trash2 } from "lucide-react";
import { useTransition } from "react";

export default function DeleteDeliveryButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => {
        if (confirm("Are you sure you want to delete this delivery request?")) {
          startTransition(() => deleteDeliveryRequest(id));
        }
      }}
      disabled={isPending}
      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50 p-2  hover:bg-red-50 dark:hover:bg-red-900/20"
      title="Delete Request"
    >
      <Trash2 size={18} />
    </button>
  );
}
