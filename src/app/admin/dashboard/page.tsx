import { createClient } from "@/lib/supabase/server";
import DashboardChart from "./DashboardChart";

export default async function DashboardOverview() {
  const supabase = await createClient();
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const [
    { data: completedData },
    { data: requestsData }
  ] = await Promise.all([
    supabase.from('CompletedDelivery').select('id, completedAt').gte('completedAt', thirtyDaysAgo),
    supabase.from('DeliveryRequest').select('id, createdAt').gte('createdAt', thirtyDaysAgo)
  ]);

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  type ChartData = {
    dateStr: string;
    name: string;
    Demandes: number;
    Terminées: number;
  };

  const weeklyChartData: ChartData[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    weeklyChartData.push({
      dateStr: d.toISOString().split('T')[0],
      name: daysOfWeek[d.getDay()],
      Demandes: 0,
      Terminées: 0
    });
  }

  const monthlyChartData: ChartData[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    monthlyChartData.push({
      dateStr: d.toISOString().split('T')[0],
      name: d.toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' }),
      Demandes: 0,
      Terminées: 0
    });
  }

  if (requestsData) {
    requestsData.forEach(req => {
      if (!req.createdAt) return;
      try {
        const dateStr = new Date(req.createdAt).toISOString().split('T')[0];
        const wData = weeklyChartData.find(d => d.dateStr === dateStr);
        if (wData) wData.Demandes += 1;
        const mData = monthlyChartData.find(d => d.dateStr === dateStr);
        if (mData) mData.Demandes += 1;
      } catch (e) {
        console.error("Invalid date format", req.createdAt);
      }
    });
  }

  if (completedData) {
    completedData.forEach(comp => {
      if (!comp.completedAt) return;
      try {
        const dateStr = new Date(comp.completedAt).toISOString().split('T')[0];
        const wData = weeklyChartData.find(d => d.dateStr === dateStr);
        if (wData) wData.Terminées += 1;
        const mData = monthlyChartData.find(d => d.dateStr === dateStr);
        if (mData) mData.Terminées += 1;
      } catch (e) {
        console.error("Invalid date format", comp.completedAt);
      }
    });
  }

  return (
    <div>
      <h1 className="text-3xl font-light tracking-wide text-slate-900 mb-10 flex items-center gap-3" dir="ltr">
        Tableau de bord
      </h1>
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-10" dir="ltr">
        <div className="bg-white border border-gray-200 p-8 shadow-sm rounded-xl">
          <h3 className="text-lg font-bold text-slate-800 mb-6 border-b border-gray-100 pb-4">Performance Hebdomadaire</h3>
          <DashboardChart data={weeklyChartData} />
        </div>
        
        <div className="bg-white border border-gray-200 p-8 shadow-sm rounded-xl">
          <h3 className="text-lg font-bold text-slate-800 mb-6 border-b border-gray-100 pb-4">Performance de 30 Jours</h3>
          <DashboardChart data={monthlyChartData} />
        </div>
      </div>
    </div>
  );
}
