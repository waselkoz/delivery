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
    <div className="bg-white border border-gray-200 p-8 mb-8 max-w-2xl shadow-sm rounded-none">
      <h3 className="text-lg font-bold tracking-wide text-slate-900 mb-6 flex items-center gap-2">
        <span className="w-1.5 h-1.5 bg-indigo-500"></span>
        Add Gallery Photo
      </h3>
      <form ref={formRef} action={handleAction} className="space-y-4">
        <div>
          <label htmlFor="imageFile" className="block text-sm font-bold tracking-wide text-slate-700">Image File</label>
          <input required type="file" accept="image/*" name="imageFile" id="imageFile" className="mt-2 block w-full text-sm text-slate-700 border border-gray-200 cursor-pointer bg-slate-50 focus:outline-none file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-bold file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200 file:transition-all rounded-none" />
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label htmlFor="caption" className="block text-sm font-bold tracking-wide text-slate-700">Caption (Optional)</label>
            <input type="text" name="caption" id="caption" className="mt-2 block w-full bg-slate-50 border border-gray-200 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 px-4 py-3 shadow-inner transition-all rounded-none" />
          </div>
          <div>
            <label htmlFor="displayOrder" className="block text-sm font-bold tracking-wide text-slate-700">Display Order</label>
            <input type="number" name="displayOrder" id="displayOrder" defaultValue={0} className="mt-2 block w-full bg-slate-50 border border-gray-200 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 px-4 py-3 shadow-inner transition-all rounded-none" />
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button type="submit" disabled={loading} className="inline-flex items-center px-6 py-3 font-bold tracking-wide text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none transition-all shadow-sm hover:shadow-md disabled:opacity-50 rounded-none uppercase">
            <Plus className="-ml-1 mr-2 h-5 w-5" strokeWidth={2} />
            {loading ? "Adding..." : "Add Photo"}
          </button>
        </div>
      </form>
    </div>
  );
}
