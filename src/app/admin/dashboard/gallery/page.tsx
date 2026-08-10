import { createClient } from "@/lib/supabase/server";
import GalleryList from "./GalleryList";
import Link from "next/link";
import { Filter } from "lucide-react";

export default async function GalleryPage({ searchParams }: { searchParams: Promise<{ pageId?: string }> }) {
  const unwrappedParams = await searchParams;
  const pageId = unwrappedParams.pageId;
  const supabase = await createClient();
  
  const { data: pagesData } = await supabase.from('LandingPage').select('id, title, slug').order('createdAt', { ascending: false });
  const pages = pagesData || [];
  
  let query = supabase.from('GalleryImage').select('*').order('displayOrder', { ascending: true });
  
  if (pageId) {
    query = query.eq('landingPageId', pageId);
  } else {
    query = query.is('landingPageId', null);
  }
  
  const { data: imagesData } = await query;
  const images = imagesData || [];

  return (
    <div>
      <div className="flex justify-between items-center mb-10" dir="ltr">
        <h1 className="text-3xl font-light tracking-wide text-slate-900">Galerie</h1>
      </div>

      <div className="bg-white border border-gray-200 shadow-sm p-4 mb-8 flex items-center gap-4" dir="ltr">
        <Filter className="text-slate-400" size={20} />
        <span className="font-bold text-slate-700">Filtrer par page:</span>
        <div className="flex flex-wrap gap-2">
          <Link 
            href="/admin/dashboard/gallery"
            className={`px-4 py-2 text-sm font-medium border ${!pageId ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-gray-200 hover:bg-slate-50'}`}
          >
            Par défaut (Sans page)
          </Link>
          {pages.map(p => (
            <Link 
              key={p.id}
              href={`/admin/dashboard/gallery?pageId=${p.id}`}
              className={`px-4 py-2 text-sm font-medium border ${pageId === p.id ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-gray-200 hover:bg-slate-50'}`}
            >
              {p.title} (/{p.slug})
            </Link>
          ))}
        </div>
      </div>

      <GalleryList initialImages={images} landingPageId={pageId || null} />
    </div>
  );
}
