import { createClient } from "@/lib/supabase/server";
import GalleryForm from "./GalleryForm";
import GalleryItemControls from "./GalleryItemControls";

type GalleryImage = {
  id: string;
  imageUrl: string;
  caption: string | null;
  displayOrder: number;
};

export default async function GalleryPage() {
  const supabase = await createClient();
  const { data: imagesData } = await supabase.from('GalleryImage').select('*').order('displayOrder', { ascending: true });
  const images = imagesData || [];

  return (
    <div>
      <h1 className="text-3xl font-light tracking-wide text-slate-900 mb-10">Posters</h1>
      
      <div className="bg-white border border-gray-200 shadow-sm rounded-none mb-12 overflow-hidden">
        <div className="px-8 py-6 bg-slate-50 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-bold tracking-wide text-slate-900">Sequence</h3>
          <span className="bg-white text-slate-900 text-xs font-bold px-3 py-1 border border-gray-300">
            {images.length} PHOTOS
          </span>
        </div>
        
        {images.length === 0 ? (
          <div className="p-12 text-center text-gray-500 dark:text-gray-400">
            <p className="mb-4 text-lg">Your landing page is currently empty.</p>
            <p className="text-sm">Add your first photo using the form below to start building your poster sequence.</p>
          </div>
        ) : (
          <ul className="space-y-4 p-4 bg-slate-50">
            {images.map((image: GalleryImage, index: number) => (
              <li key={image.id} className="p-6 bg-white border border-gray-200 rounded-none flex flex-col md:flex-row items-start md:items-center gap-8 hover:bg-slate-50 transition-all shadow-sm">
                
                {/* Number Badge */}
                <div className="flex-shrink-0 w-14 h-14 bg-white flex items-center justify-center text-slate-900 font-bold text-2xl border-2 border-gray-200 shadow-sm">
                  {index + 1}
                </div>

                {/* Thumbnail */}
                <div className="flex-shrink-0 w-48 h-32 bg-slate-100 border border-gray-200 shadow-sm overflow-hidden relative group flex justify-center items-center">
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none"></div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={image.imageUrl} 
                    alt={image.caption || `Poster ${index + 1}`} 
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110" 
                  />
                </div>

                {/* Info */}
                <div className="flex-grow min-w-0">
                  <p className="text-xs font-bold tracking-widest text-slate-600 mb-2 uppercase">
                    System Order: {image.displayOrder}
                  </p>
                  {image.caption ? (
                    <p className="text-xl font-bold text-slate-900 truncate mt-1">{image.caption}</p>
                  ) : (
                    <p className="text-lg font-medium text-slate-500 italic mt-1">No caption provided</p>
                  )}
                </div>

                {/* Controls */}
                <div className="flex-shrink-0 mt-4 md:mt-0">
                  <GalleryItemControls 
                    id={image.id} 
                    isFirst={index === 0} 
                    isLast={index === images.length - 1} 
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
          <GalleryForm />
        </div>
      </div>
    </div>
  );
}
