import { createClient } from "@/lib/supabase/server";
import GalleryList from "./GalleryList";

export default async function GalleryPage() {
  const supabase = await createClient();
  const { data: imagesData } = await supabase.from('GalleryImage').select('*').order('displayOrder', { ascending: true });
  const images = imagesData || [];

  return (
    <div>
      <h1 className="text-3xl font-light tracking-wide text-slate-900 mb-10">Posters</h1>
      <GalleryList initialImages={images} />
    </div>
  );
}
