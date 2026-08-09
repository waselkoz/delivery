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
      <h1 className="text-3xl font-light tracking-wide text-white mb-10">Posters</h1>
      
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl  mb-12 overflow-hidden">
        <div className="px-8 py-6 bg-white/5 border-b border-white/10 flex justify-between items-center">
          <h3 className="text-lg font-light tracking-wide text-white">Sequence</h3>
          <span className="bg-indigo-500/20 text-indigo-300 text-xs font-semibold px-3 py-1  border border-indigo-500/30">
            {images.length} PHOTOS
          </span>
        </div>
        
        {images.length === 0 ? (
          <div className="p-12 text-center text-gray-500 dark:text-gray-400">
            <p className="mb-4 text-lg">Your landing page is currently empty.</p>
            <p className="text-sm">Add your first photo using the form below to start building your poster sequence.</p>
          </div>
        ) : (
          <ul className="space-y-4 p-4">
            {images.map((image: GalleryImage, index: number) => (
              <li key={image.id} className="p-6 bg-white/5 backdrop-blur-sm border border-white/10  flex flex-col md:flex-row items-start md:items-center gap-8 hover:bg-white/10 transition-all hover:border-white/20 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                
                {/* Number Badge */}
                <div className="flex-shrink-0 w-14 h-14  bg-white/10 backdrop-blur flex items-center justify-center text-white font-light text-2xl border border-white/20 shadow-inner">
                  {index + 1}
                </div>

                {/* Thumbnail */}
                <div className="flex-shrink-0 w-48 h-32  border border-white/10 shadow-lg overflow-hidden relative group">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none"></div>
                  <img 
                    src={image.imageUrl} 
                    alt={image.caption || `Poster ${index + 1}`} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  />
                </div>

                {/* Info */}
                <div className="flex-grow min-w-0">
                  <p className="text-xs font-medium tracking-widest text-slate-400 mb-2 uppercase">
                    System Order: {image.displayOrder}
                  </p>
                  {image.caption ? (
                    <p className="text-xl font-light text-white truncate mt-1">{image.caption}</p>
                  ) : (
                    <p className="text-lg font-light text-white/40 italic mt-1">No caption provided</p>
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

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl  overflow-hidden">
        <div className="px-8 py-6 bg-white/5 border-b border-white/10">
          <h3 className="text-lg font-light tracking-wide text-white">Upload New Poster</h3>
        </div>
        <div className="p-6">
          <GalleryForm />
        </div>
      </div>
    </div>
  );
}
