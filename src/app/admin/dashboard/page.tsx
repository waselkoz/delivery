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
        <div className="bg-white border-t-4 border-t-indigo-500 border-x border-b border-gray-200 p-8 shadow-sm relative overflow-hidden group hover:shadow-lg transition-all rounded-none">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <h3 className="text-sm font-bold text-slate-600 mb-2 tracking-widest uppercase relative z-10">Total Deliveries</h3>
          <p className="text-6xl font-light tracking-tight text-slate-900 mt-4 relative z-10">{deliveryCount}</p>
        </div>
        
        <div className="bg-white border-t-4 border-t-fuchsia-500 border-x border-b border-gray-200 p-8 shadow-sm relative overflow-hidden group hover:shadow-lg transition-all rounded-none">
          <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <h3 className="text-sm font-bold text-slate-600 mb-2 tracking-widest uppercase relative z-10">Gallery Images</h3>
          <p className="text-6xl font-light tracking-tight text-slate-900 mt-4 relative z-10">{imageCount}</p>
        </div>
      </div>
    </div>
  );
}
