import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Image as ImageIcon } from "lucide-react";
import DeliveryRequestForm from "./DeliveryRequestForm";

type GalleryImage = {
  id: string;
  imageUrl: string;
  caption: string | null;
  displayOrder: number;
};

export default async function Home() {
  const supabase = await createClient();
  const { data: config } = await supabase.from('LandingPageConfig').select('*').limit(1).maybeSingle();
  const { data: galleryData } = await supabase.from('GalleryImage').select('*').order('displayOrder', { ascending: true });
  const gallery = galleryData || [];

  return (
    <div className="min-h-screen bg-white font-sans relative">
      {/* Admin Link Floating Top Right */}
      <div className="absolute top-6 right-6 z-50">
        <Link href="/admin" className="text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 shadow-sm px-4 py-2  text-sm font-medium transition-colors border border-gray-200">
          Admin Portal
        </Link>
      </div>

      {/* Image Stack */}
      <div className="flex flex-col w-full max-w-7xl mx-auto px-6 md:px-24">
        {gallery.length === 0 ? (
          <div className="h-screen flex flex-col items-center justify-center text-white/50 bg-gray-900">
            <ImageIcon className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-xl">No photos uploaded yet.</p>
            <p className="text-sm mt-2 text-white/30">Go to the admin portal to upload your poster images.</p>
          </div>
        ) : (
          gallery.map((image: GalleryImage) => (
            <div key={image.id} className="w-full relative">
              <img 
                src={image.imageUrl} 
                alt={image.caption || "Delivery Poster"} 
                className="w-full h-auto object-cover block" 
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

      {/* Delivery Request Form Section */}
      <section className="py-20 md:py-32 bg-gray-50 border-t border-gray-100 relative">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4" style={{ color: config?.formTextColor || "#111827" }}>
              {config?.formTitle || "Ready to Deliver?"}
            </h2>
            <p className="text-lg" style={{ color: config?.formTextColor || "#111827", opacity: 0.8 }}>
              {config?.formSubtitle || "Fill out the form below and we'll handle the rest."}
            </p>
          </div>
          <div className="animate-fade-in-up">
            <DeliveryRequestForm config={config} />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
