import { createClient } from "@/lib/supabase/server";

export default async function DashboardOverview() {
  const supabase = await createClient();
  const [
    { count: deliveryCount },
    { count: imageCount }
  ] = await Promise.all([
    supabase.from('DeliveryRequest').select('*', { count: 'exact', head: true }),
    supabase.from('GalleryImage').select('*', { count: 'exact', head: true })
  ]);

  return (
    <div>
      <h1 className="text-3xl font-light tracking-wide text-slate-900 mb-10 flex items-center gap-3">
        Dashboard
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white border border-gray-300 p-8 shadow-sm relative overflow-hidden group hover:shadow-md transition-all rounded-none">
          <h3 className="text-sm font-bold text-slate-800 mb-2 tracking-widest uppercase relative z-10">Total Deliveries</h3>
          <p className="text-6xl font-medium tracking-tight text-slate-900 mt-4 relative z-10">{deliveryCount}</p>
        </div>
        
        <div className="bg-white border border-gray-300 p-8 shadow-sm relative overflow-hidden group hover:shadow-md transition-all rounded-none">
          <h3 className="text-sm font-bold text-slate-800 mb-2 tracking-widest uppercase relative z-10">Gallery Images</h3>
          <p className="text-6xl font-medium tracking-tight text-slate-900 mt-4 relative z-10">{imageCount}</p>
        </div>
      </div>
    </div>
  );
}
