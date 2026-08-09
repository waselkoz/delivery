import { createClient } from "@/lib/supabase/server";
import DeliveryStatusSelect from "./DeliveryStatusSelect";

type DeliveryRequest = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  destination: string;
  createdAt: string;
  updatedAt: string;
};

export default async function DeliveriesPage() {
  const supabase = await createClient();
  const [
    { data: deliveriesData },
    { data: completedDeliveriesData },
    { data: cancelledDeliveriesData }
  ] = await Promise.all([
    supabase.from('DeliveryRequest').select('*').order('createdAt', { ascending: false }),
    supabase.from('CompletedDelivery').select('*').order('completedAt', { ascending: false }),
    supabase.from('CancelledDelivery').select('*').order('cancelledAt', { ascending: false })
  ]);

  const deliveries = deliveriesData || [];
  const completedDeliveries = completedDeliveriesData || [];
  const cancelledDeliveries = cancelledDeliveriesData || [];

  return (
    <div>
      <h1 className="text-3xl font-light tracking-wide text-slate-900 mb-10">Requests</h1>

      <div className="bg-white border border-gray-200 shadow-sm rounded-none mb-12 overflow-hidden">
        <div className="px-8 py-6 bg-slate-50 border-b border-gray-200">
          <h3 className="text-lg font-bold tracking-wide text-slate-900">Delivery Queue</h3>
        </div>
        
        {deliveries.length === 0 ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            No delivery requests found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-3 px-4">
              <thead className="bg-slate-100/50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-5 text-left font-bold text-slate-700 uppercase tracking-widest text-xs">Date</th>
                  <th className="px-6 py-5 text-left font-bold text-slate-700 uppercase tracking-widest text-xs">Client Name</th>
                  <th className="px-6 py-5 text-left font-bold text-slate-700 uppercase tracking-widest text-xs">Phone</th>
                  <th className="px-6 py-5 text-left font-bold text-slate-700 uppercase tracking-widest text-xs">Destination</th>
                  <th className="px-6 py-5 text-left font-bold text-slate-700 uppercase tracking-widest text-xs">Status</th>
                  <th className="px-6 py-5 text-right font-bold text-slate-700 uppercase tracking-widest text-xs">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {deliveries.map((delivery: DeliveryRequest) => (
                  <tr key={delivery.id} className="hover:bg-indigo-50/50 transition-colors border-b border-gray-100 last:border-0">
                    <td className="px-6 py-5 text-sm text-slate-600 font-medium">
                      {new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(delivery.createdAt))}
                    </td>
                    <td className="px-6 py-5 text-base font-bold text-slate-900">
                      {delivery.firstName} {delivery.lastName}
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-600">
                      {delivery.phone}
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-600 max-w-xs truncate" title={delivery.destination}>
                      {delivery.destination}
                    </td>
                    <td className="px-6 py-5">
                      <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-widest border text-yellow-400 bg-yellow-500/10 border-yellow-500/20">
                        PENDING
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <DeliveryStatusSelect id={delivery.id} currentStatus="Pending" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className="bg-white border border-gray-200 shadow-sm rounded-none mb-12 overflow-hidden">
        <div className="px-8 py-6 bg-slate-50 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-bold tracking-wide text-slate-900">Completed Deliveries (Audit Log)</h3>
          <span className="text-emerald-700 bg-emerald-100 border border-emerald-200 px-3 py-1 text-xs font-bold uppercase tracking-widest">{completedDeliveries.length} Records</span>
        </div>
        
        {completedDeliveries.length === 0 ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            No completed deliveries yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-3 px-4">
              <thead className="bg-slate-100/50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-5 text-left font-bold text-slate-700 uppercase tracking-widest text-xs">Completed On</th>
                  <th className="px-6 py-5 text-left font-bold text-slate-700 uppercase tracking-widest text-xs">Client Name</th>
                  <th className="px-6 py-5 text-left font-bold text-slate-700 uppercase tracking-widest text-xs">Phone</th>
                  <th className="px-6 py-5 text-left font-bold text-slate-700 uppercase tracking-widest text-xs">Destination</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {completedDeliveries.map((delivery) => (
                  <tr key={delivery.id} className="hover:bg-slate-50 transition-colors border-b border-gray-100 last:border-0">
                    <td className="px-6 py-5 text-sm text-emerald-600 font-bold">
                      {new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(delivery.completedAt))}
                    </td>
                    <td className="px-6 py-5 text-base font-bold text-slate-900">
                      {delivery.firstName} {delivery.lastName}
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-600">
                      {delivery.phone}
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-600 max-w-xs truncate" title={delivery.destination}>
                      {delivery.destination}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-white border border-gray-200 shadow-sm rounded-none mb-12 overflow-hidden">
        <div className="px-8 py-6 bg-slate-50 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-bold tracking-wide text-slate-900">Cancelled Deliveries (Audit Log)</h3>
          <span className="text-red-700 bg-red-100 border border-red-200 px-3 py-1 text-xs font-bold uppercase tracking-widest">{cancelledDeliveries.length} Records</span>
        </div>
        
        {cancelledDeliveries.length === 0 ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            No cancelled deliveries yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-3 px-4">
              <thead className="bg-slate-100/50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-5 text-left font-bold text-slate-700 uppercase tracking-widest text-xs">Cancelled On</th>
                  <th className="px-6 py-5 text-left font-bold text-slate-700 uppercase tracking-widest text-xs">Client Name</th>
                  <th className="px-6 py-5 text-left font-bold text-slate-700 uppercase tracking-widest text-xs">Phone</th>
                  <th className="px-6 py-5 text-left font-bold text-slate-700 uppercase tracking-widest text-xs">Destination</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {cancelledDeliveries.map((delivery) => (
                  <tr key={delivery.id} className="hover:bg-slate-50 transition-colors border-b border-gray-100 last:border-0">
                    <td className="px-6 py-5 text-sm text-red-600 font-bold">
                      {new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(delivery.cancelledAt))}
                    </td>
                    <td className="px-6 py-5 text-base font-bold text-slate-900">
                      {delivery.firstName} {delivery.lastName}
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-600">
                      {delivery.phone}
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-600 max-w-xs truncate" title={delivery.destination}>
                      {delivery.destination}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
