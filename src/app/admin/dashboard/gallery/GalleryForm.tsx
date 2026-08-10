"use client";

import { useRef, useState } from "react";
import { addGalleryImage } from "./actions";
import { Plus } from "lucide-react";
import imageCompression from 'browser-image-compression';

export default function GalleryForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const isSubmitting = useRef(false);

  async function handleAction(formData: FormData) {
    if (isSubmitting.current) return;
    isSubmitting.current = true;
    setLoading(true);
    try {
      let file = formData.get("imageFile") as File;
      if (file && file.size > 0) {
        try {
          const options = { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true };
          const compressedFile = await imageCompression(file, options);
          formData.set("imageFile", compressedFile);
        } catch (error) {
          console.error("Compression error:", error);
        }
      }

      const result = await addGalleryImage(formData);
      if (result && result.error) {
        alert(result.error);
      } else {
        formRef.current?.reset();
      }
    } catch (err: any) {
      alert("Network or unknown error occurred: " + err.message);
    } finally {
      isSubmitting.current = false;
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <form ref={formRef} action={handleAction} className="space-y-4">
        <div>
          <label htmlFor="imageFile" className="block text-sm font-bold tracking-wide text-slate-700">Image File</label>
          <input required type="file" accept="image/*" name="imageFile" id="imageFile" className="mt-2 block w-full text-sm text-slate-700 border border-gray-200 cursor-pointer bg-slate-50 focus:outline-none file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-bold file:bg-gray-200 file:text-slate-900 hover:file:bg-gray-300 file:transition-all rounded-none" />
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
