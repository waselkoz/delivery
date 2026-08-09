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
        <div className="bg-white border border-gray-200 p-8 shadow-sm relative overflow-hidden group hover:border-indigo-500/50 hover:shadow-md transition-all rounded-none">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <h3 className="text-sm font-bold text-slate-500 mb-2 tracking-wide uppercase relative z-10">Total Deliveries</h3>
          <p className="text-6xl font-light tracking-tight text-slate-900 mt-4 relative z-10">{deliveryCount}</p>
        </div>
        
        <div className="bg-white border border-gray-200 p-8 shadow-sm relative overflow-hidden group hover:border-fuchsia-500/50 hover:shadow-md transition-all rounded-none">
          <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <h3 className="text-sm font-bold text-slate-500 mb-2 tracking-wide uppercase relative z-10">Gallery Images</h3>
          <p className="text-6xl font-light tracking-tight text-slate-900 mt-4 relative z-10">{imageCount}</p>
        </div>
      </div>
    </div>
  );
}
