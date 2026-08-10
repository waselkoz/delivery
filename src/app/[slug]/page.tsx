import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import Image from "next/image";
import nextDynamic from "next/dynamic";
import { Image as ImageIcon } from "lucide-react";
import { notFound } from "next/navigation";

const DeliveryRequestForm = nextDynamic(() => import('@/app/DeliveryRequestForm'), {
  loading: () => (
    <div className="h-[500px] w-full flex items-center justify-center bg-white/5 border border-gray-100 rounded-sm">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-400 text-sm">Chargement du formulaire de commande...</p>
      </div>
    </div>
  )
});

export const dynamic = 'force-dynamic';

type GalleryImage = {
  id: string;
  imageUrl: string;
  caption: string | null;
  displayOrder: number;
};

export default async function LandingPageDynamic({ params }: { params: Promise<{ slug: string }> }) {
  const unwrappedParams = await params;
  const slug = unwrappedParams.slug;
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  
  const { data: landingPage } = await supabase
    .from('LandingPage')
    .select('*')
    .eq('slug', slug)
    .single();
    
  if (!landingPage) {
    notFound();
  }

  const { data: galleryData } = await supabase
    .from('GalleryImage')
    .select('*')
    .eq('landingPageId', landingPage.id)
    .order('displayOrder', { ascending: true });
  
  const gallery = galleryData || [];

  return (
    <div className="min-h-screen bg-white font-sans relative">
      <div className="flex flex-col w-full max-w-7xl mx-auto px-6 md:px-24">
        {gallery.length === 0 ? (
          <div className="h-screen flex flex-col items-center justify-center text-white/50 bg-gray-900" dir="ltr">
            <ImageIcon className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-xl">Aucune image n'a encore été téléchargée.</p>
            <p className="text-sm mt-2 text-white/30">Accédez au portail d'administration pour télécharger les images de vos affiches.</p>
          </div>
        ) : (
          gallery.map((image: GalleryImage, index: number) => (
            <div key={image.id} className="w-full relative flex justify-center bg-white">
              <Image 
                src={image.imageUrl} 
                alt={image.caption || "Delivery Poster"}
                width={1920}
                height={1080}
                sizes="(max-width: 1280px) 100vw, 1280px"
                style={{ width: '100%', height: 'auto' }}
                priority={index === 0}
                fetchPriority={index === 0 ? 'high' : 'auto'}
                quality={90}
                className="block" 
              />
              {image.caption && (
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-6 md:p-12">
                  <p className="text-white font-medium text-xl md:text-3xl max-w-4xl">{image.caption}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <section className="py-20 md:py-32 bg-gray-50 border-t border-gray-100 relative">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4" style={{ color: "#111827" }}>
              {landingPage.title}
            </h2>
            <p className="text-lg" style={{ color: "#111827", opacity: 0.8 }}>
              {landingPage.subtitle}
            </p>
          </div>
          <div className="animate-fade-in-up">
            <DeliveryRequestForm page={landingPage} />
          </div>
        </div>
      </section>

      <footer className="bg-white py-12 border-t border-gray-100" dir="ltr">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
}
