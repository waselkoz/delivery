import { createClient } from "@/lib/supabase/server";
import GalleryForm from "./GalleryForm";
import GalleryList from "./GalleryList";

export default async function GalleryPage() {
  const supabase = await createClient();
  const { data: imagesData } = await supabase.from('GalleryImage').select('*').order('displayOrder', { ascending: true });
  const images = imagesData || [];

  return (
    <div>
      <h1 className="text-3xl font-light tracking-wide text-slate-900 mb-10">Posters</h1>
      
      <GalleryList initialImages={images} />

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
