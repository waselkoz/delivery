"use client";

import { useOptimistic, useRef } from "react";
import GalleryItemControls from "./GalleryItemControls";
import { Plus } from "lucide-react";
import { addGalleryImage } from "./actions";
import toast from "react-hot-toast";

export type GalleryImage = {
  id: string;
  imageUrl: string;
  caption: string | null;
  displayOrder: number;
};

export default function GalleryList({ initialImages, landingPageId }: { initialImages: GalleryImage[], landingPageId: string | null }) {
  const formRef = useRef<HTMLFormElement>(null);
  const isSubmitting = useRef(false);

  const [optimisticImages, addOptimisticUpdate] = useOptimistic(
    initialImages,
    (state: GalleryImage[], action: { type: 'moveUp' | 'moveDown' | 'delete' | 'add', id: string, imageUrl?: string }) => {
      const newState = [...state];
      
      if (action.type === 'add') {
        newState.push({
          id: action.id,
          imageUrl: action.imageUrl!,
          caption: null,
          displayOrder: newState.length
        });
        return newState;
      }

      const index = state.findIndex(img => img.id === action.id);
      if (index === -1) return state;

      if (action.type === 'delete') {
        newState.splice(index, 1);
      } else if (action.type === 'moveUp' && index > 0) {
        const temp = newState[index];
        newState[index] = newState[index - 1];
        newState[index - 1] = temp;
      } else if (action.type === 'moveDown' && index < newState.length - 1) {
        const temp = newState[index];
        newState[index] = newState[index + 1];
        newState[index + 1] = temp;
      }

      return newState.map((img, i) => ({ ...img, displayOrder: i }));
    }
  );

  async function handleAction(formData: FormData) {
    if (isSubmitting.current) return;
    isSubmitting.current = true;
    
    let file = formData.get("imageFile") as File;
    if (!file || file.size === 0) {
      isSubmitting.current = false;
      return;
    }
    
    const tempId = crypto.randomUUID();
    const tempUrl = URL.createObjectURL(file);
    addOptimisticUpdate({ type: 'add', id: tempId, imageUrl: tempUrl });
    
    try {
      const imageCompression = (await import('browser-image-compression')).default;
      const options = { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true };
      const compressedFile = await imageCompression(file, options);
      formData.set("imageFile", compressedFile);
      
      if (landingPageId) {
        formData.append("landingPageId", landingPageId);
      }
      
      const result = await addGalleryImage(formData);
      if (result && result.error) {
        toast.error(result.error);
      } else {
        formRef.current?.reset();
      }
    } catch (err: any) {
      toast.error("Network or unknown error occurred: " + err.message);
    } finally {
      isSubmitting.current = false;
    }
  }

  return (
    <>
      <div className="bg-white border border-gray-200 shadow-sm rounded-none mb-12 overflow-hidden">
        <div className="px-8 py-6 bg-slate-50 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-bold tracking-wide text-slate-900">Sequence</h3>
          <span className="bg-white text-slate-900 text-xs font-bold px-3 py-1 border border-gray-300">
            {optimisticImages.length} images
          </span>
        </div>
        
        {optimisticImages.length === 0 ? (
          <div className="p-12 text-center text-gray-500 dark:text-gray-400">
            <p className="mb-4 text-lg">Landing page is currently empty.</p>
            <p className="text-sm">Add your first image using the form below to get started.</p>
          </div>
        ) : (
          <ul className="space-y-4 p-4 bg-slate-50">
            {optimisticImages.map((image, index) => (
              <li key={image.id} className="p-6 bg-white border border-gray-200 rounded-none flex flex-col md:flex-row items-start md:items-center gap-8 hover:bg-slate-50 transition-all shadow-sm">
                <div className="flex-shrink-0 w-14 h-14 bg-white flex items-center justify-center text-slate-900 font-bold text-2xl border-2 border-gray-200 shadow-sm">
                  {index + 1}
                </div>

                <div className="flex-shrink-0 w-48 h-32 bg-slate-100 border border-gray-200 shadow-sm overflow-hidden relative group flex justify-center items-center">
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none"></div>
                  <img 
                    src={image.imageUrl} 
                    alt={image.caption || `Poster ${index + 1}`} 
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110" 
                  />
                  {image.imageUrl.startsWith("blob:") && (
                    <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-20 backdrop-blur-sm">
                       <span className="text-xs font-bold uppercase tracking-widest text-slate-900 animate-pulse">Uploading...</span>
                    </div>
                  )}
                </div>

                <div className="flex-grow"></div>

                <div className="flex-shrink-0 mt-4 md:mt-0">
                  <GalleryItemControls 
                    id={image.id} 
                    isFirst={index === 0} 
                    isLast={index === optimisticImages.length - 1} 
                    onOptimisticUpdate={(type) => addOptimisticUpdate({ type, id: image.id })}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="bg-white border border-gray-200 shadow-sm rounded-none overflow-hidden">
        <div className="px-8 py-6 bg-slate-50 border-b border-gray-200">
          <h3 className="text-lg font-bold tracking-wide text-slate-900">Upload New Poster</h3>
        </div>
        <div className="p-6">
          <div className="max-w-2xl">
            <form ref={formRef} action={handleAction} className="space-y-4">
              <div>
                <label htmlFor="imageFile" className="block text-sm font-bold tracking-wide text-slate-700">Image File</label>
                <input required type="file" accept="image/*" name="imageFile" id="imageFile" className="mt-2 block w-full text-sm text-slate-700 border border-gray-200 cursor-pointer bg-slate-50 focus:outline-none file:mr-4 file:ml-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-bold file:bg-gray-200 file:text-slate-900 hover:file:bg-gray-300 file:transition-all rounded-none" />
              </div>

              <div className="pt-4 flex justify-end">
                <button type="submit" className="inline-flex items-center px-6 py-3 font-bold tracking-wide text-white bg-slate-900 hover:bg-black focus:outline-none transition-all shadow-sm hover:shadow-md disabled:opacity-50 rounded-none uppercase">
                  <Plus className="-ml-1 mr-2 h-5 w-5" strokeWidth={2} />
                  Add Image
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
