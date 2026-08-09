"use client";

import { useRef, useState } from "react";
import { addGalleryImage } from "./actions";
import { Plus } from "lucide-react";

export default function GalleryForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);

  async function handleAction(formData: FormData) {
    setLoading(true);
    await addGalleryImage(formData);
    formRef.current?.reset();
    setLoading(false);
  }

  return (
    <div className="max-w-2xl">
      <form ref={formRef} action={handleAction} className="space-y-4">
        <div>
          <label htmlFor="imageFile" className="block text-sm font-bold tracking-wide text-slate-700">Image File</label>
          <input required type="file" accept="image/*" name="imageFile" id="imageFile" className="mt-2 block w-full text-sm text-slate-700 border border-gray-200 cursor-pointer bg-slate-50 focus:outline-none file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-bold file:bg-gray-200 file:text-slate-900 hover:file:bg-gray-300 file:transition-all rounded-none" />
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label htmlFor="caption" className="block text-sm font-bold tracking-wide text-slate-800">Caption (Optional)</label>
            <input type="text" name="caption" id="caption" className="mt-2 block w-full bg-white border-2 border-gray-300 text-slate-900 font-bold focus:outline-none focus:ring-0 focus:border-slate-900 px-4 py-3 shadow-sm hover:border-gray-400 transition-colors rounded-none" />
          </div>
          <div>
            <label htmlFor="displayOrder" className="block text-sm font-bold tracking-wide text-slate-800">Display Order</label>
            <input type="number" name="displayOrder" id="displayOrder" defaultValue={0} className="mt-2 block w-full bg-white border-2 border-gray-300 text-slate-900 font-bold focus:outline-none focus:ring-0 focus:border-slate-900 px-4 py-3 shadow-sm hover:border-gray-400 transition-colors rounded-none" />
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button type="submit" disabled={loading} className="inline-flex items-center px-6 py-3 font-bold tracking-wide text-white bg-slate-900 hover:bg-black focus:outline-none transition-all shadow-sm hover:shadow-md disabled:opacity-50 rounded-none uppercase">
            <Plus className="-ml-1 mr-2 h-5 w-5" strokeWidth={2} />
            {loading ? "Adding..." : "Add Photo"}
          </button>
        </div>
      </form>
    </div>
  );
}
