"use client";

import { useOptimistic } from "react";
import GalleryItemControls from "./GalleryItemControls";

export type GalleryImage = {
  id: string;
  imageUrl: string;
  caption: string | null;
  displayOrder: number;
};

export default function GalleryList({ initialImages }: { initialImages: GalleryImage[] }) {
  const [optimisticImages, addOptimisticUpdate] = useOptimistic(
    initialImages,
    (state: GalleryImage[], action: { type: 'moveUp' | 'moveDown' | 'delete', id: string }) => {
      const index = state.findIndex(img => img.id === action.id);
      if (index === -1) return state;

      const newState = [...state];

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

      // Re-assign displayOrder sequentially based on new array order
      return newState.map((img, i) => ({ ...img, displayOrder: i }));
    }
  );

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-none mb-12 overflow-hidden">
      <div className="px-8 py-6 bg-slate-50 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-bold tracking-wide text-slate-900">Sequence</h3>
        <span className="bg-white text-slate-900 text-xs font-bold px-3 py-1 border border-gray-300">
          {optimisticImages.length} PHOTOS
        </span>
      </div>
      
      {optimisticImages.length === 0 ? (
        <div className="p-12 text-center text-gray-500 dark:text-gray-400">
          <p className="mb-4 text-lg">Your landing page is currently empty.</p>
          <p className="text-sm">Add your first photo using the form below to start building your poster sequence.</p>
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
  );
}
