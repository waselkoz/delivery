import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import Image from "next/image";
import nextDynamic from "next/dynamic";
import { Image as ImageIcon } from "lucide-react";

const DeliveryRequestForm = nextDynamic(() => import('@/app/DeliveryRequestForm'), {
  loading: () => (
    <div className="h-[500px] w-full flex items-center justify-center bg-white/5 border border-gray-100 rounded-sm">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-400 text-sm">جاري تحميل نموذج الطلب...</p>
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

export default async function Home() {
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: galleryData } = await supabase
    .from('GalleryImage')
    .select('*')
    .is('landingPageId', null)
    .order('displayOrder', { ascending: true });
  
  const gallery = galleryData || [];

  return (
    <div className="min-h-screen bg-white font-sans relative">
      <div className="flex flex-col w-full max-w-7xl mx-auto px-6 md:px-24">
        {gallery.map((image: GalleryImage, index: number) => (
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
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-6 md:p-12" dir="rtl">
                <p className="text-white font-medium text-xl md:text-3xl max-w-4xl">{image.caption}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <section className="py-20 md:py-32 bg-gray-50 relative">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12" dir="rtl">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-gray-900">
              توصيل سريع وموثوق
            </h2>
            <p className="text-lg text-gray-600">
              املأ النموذج أدناه وسنقوم بتوصيل طلبك في أسرع وقت.
            </p>
          </div>
          <div className="animate-fade-in-up">
            <DeliveryRequestForm />
          </div>
        </div>
      </section>

      <footer className="bg-white py-12 border-t border-gray-100" dir="rtl">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} جميع الحقوق محفوظة.
          </p>
        </div>
      </footer>
    </div>
  );
}
