"use client";

import { deleteGalleryImage } from "./actions";
import { Trash2 } from "lucide-react";
import { useTransition } from "react";

export default function DeleteGalleryButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => startTransition(() => deleteGalleryImage(id))}
      disabled={isPending}
      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50"
    >
      <Trash2 size={18} />
    </button>
  );
}
