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
    <div className="bg-white/5 backdrop-blur-xl  border border-white/10 p-8 mb-8 max-w-2xl shadow-2xl">
      <h3 className="text-lg font-light tracking-wide text-white mb-6 flex items-center gap-2">
        <span className="w-1.5 h-1.5  bg-indigo-500"></span>
        Add Gallery Photo
      </h3>
      <form ref={formRef} action={handleAction} className="space-y-4">
        <div>
          <label htmlFor="imageFile" className="block text-sm font-medium tracking-wide text-slate-300">Image File</label>
          <input required type="file" accept="image/*" name="imageFile" id="imageFile" className="mt-2 block w-full text-sm text-slate-300 border border-white/10  cursor-pointer bg-white/5 focus:outline-none file:mr-4 file:py-2 file:px-4 file: file:border-0 file:text-sm file:font-semibold file:bg-indigo-500/20 file:text-indigo-300 hover:file:bg-indigo-500/30 file:transition-all" />
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label htmlFor="caption" className="block text-sm font-medium tracking-wide text-slate-300">Caption (Optional)</label>
            <input type="text" name="caption" id="caption" className="mt-2 block w-full bg-white/5 border border-white/10  text-white font-light focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 px-4 py-3 shadow-inner transition-all" />
          </div>
          <div>
            <label htmlFor="displayOrder" className="block text-sm font-medium tracking-wide text-slate-300">Display Order</label>
            <input type="number" name="displayOrder" id="displayOrder" defaultValue={0} className="mt-2 block w-full bg-white/5 border border-white/10  text-white font-light focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 px-4 py-3 shadow-inner transition-all" />
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button type="submit" disabled={loading} className="inline-flex items-center px-6 py-3  font-medium tracking-wide text-white bg-indigo-500 hover:bg-indigo-600 focus:outline-none transition-all shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] disabled:opacity-50">
            <Plus className="-ml-1 mr-2 h-5 w-5" strokeWidth={2} />
            {loading ? "Adding..." : "Add Photo"}
          </button>
        </div>
      </form>
    </div>
  );
}
