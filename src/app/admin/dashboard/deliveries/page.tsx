import { prisma } from "@/lib/prisma";
import type { DeliveryRequest } from "@/generated/prisma/client";
import DeliveryStatusSelect from "./DeliveryStatusSelect";

export default async function DeliveriesPage() {
  const deliveries = await prisma.deliveryRequest.findMany({
    orderBy: { createdAt: "desc" },
  });
  
  const completedDeliveries = await prisma.completedDelivery.findMany({
    orderBy: { completedAt: "desc" },
  });

  const cancelledDeliveries = await prisma.cancelledDelivery.findMany({
    orderBy: { cancelledAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-3xl font-light tracking-wide text-white mb-10">Requests</h1>

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl  mb-12 overflow-hidden">
        <div className="px-8 py-6 bg-white/5 border-b border-white/10">
          <h3 className="text-lg font-light tracking-wide text-white">Delivery Queue</h3>
        </div>
        
        {deliveries.length === 0 ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            No delivery requests found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-3 px-4">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 text-left font-medium text-slate-300 uppercase tracking-widest text-xs">Date</th>
                  <th className="px-6 py-4 text-left font-medium text-slate-300 uppercase tracking-widest text-xs">Client Name</th>
                  <th className="px-6 py-4 text-left font-medium text-slate-300 uppercase tracking-widest text-xs">Phone</th>
                  <th className="px-6 py-4 text-left font-medium text-slate-300 uppercase tracking-widest text-xs">Destination</th>
                  <th className="px-6 py-4 text-left font-medium text-slate-300 uppercase tracking-widest text-xs">Status</th>
                  <th className="px-6 py-4 text-right font-medium text-slate-300 uppercase tracking-widest text-xs">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-transparent">
                {deliveries.map((delivery: DeliveryRequest) => (
                  <tr key={delivery.id} className="bg-white/5 hover:bg-white/10 backdrop-blur-sm transition-all border border-white/10 shadow-lg ">
                    <td className="px-6 py-5 text-sm text-slate-400">
                      {new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(delivery.createdAt))}
                    </td>
                    <td className="px-6 py-5 text-base font-light text-white">
                      {delivery.firstName} {delivery.lastName}
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-400">
                      {delivery.phone}
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-400 max-w-xs truncate" title={delivery.destination}>
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
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl  mb-12 overflow-hidden">
        <div className="px-8 py-6 bg-white/5 border-b border-white/10 flex items-center justify-between">
          <h3 className="text-lg font-light tracking-wide text-white">Completed Deliveries (Audit Log)</h3>
          <span className="text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-widest">{completedDeliveries.length} Records</span>
        </div>
        
        {completedDeliveries.length === 0 ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            No completed deliveries yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-3 px-4">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 text-left font-medium text-slate-300 uppercase tracking-widest text-xs">Completed On</th>
                  <th className="px-6 py-4 text-left font-medium text-slate-300 uppercase tracking-widest text-xs">Client Name</th>
                  <th className="px-6 py-4 text-left font-medium text-slate-300 uppercase tracking-widest text-xs">Phone</th>
                  <th className="px-6 py-4 text-left font-medium text-slate-300 uppercase tracking-widest text-xs">Destination</th>
                </tr>
              </thead>
              <tbody className="bg-transparent">
                {completedDeliveries.map((delivery) => (
                  <tr key={delivery.id} className="bg-white/5 hover:bg-white/10 backdrop-blur-sm transition-all border border-white/10 shadow-lg ">
                    <td className="px-6 py-5 text-sm text-emerald-400 font-medium">
                      {new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(delivery.completedAt))}
                    </td>
                    <td className="px-6 py-5 text-base font-light text-white">
                      {delivery.firstName} {delivery.lastName}
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-400">
                      {delivery.phone}
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-400 max-w-xs truncate" title={delivery.destination}>
                      {delivery.destination}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl  mb-12 overflow-hidden">
        <div className="px-8 py-6 bg-white/5 border-b border-white/10 flex items-center justify-between">
          <h3 className="text-lg font-light tracking-wide text-white">Cancelled Deliveries (Audit Log)</h3>
          <span className="text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-widest">{cancelledDeliveries.length} Records</span>
        </div>
        
        {cancelledDeliveries.length === 0 ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            No cancelled deliveries yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-3 px-4">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 text-left font-medium text-slate-300 uppercase tracking-widest text-xs">Cancelled On</th>
                  <th className="px-6 py-4 text-left font-medium text-slate-300 uppercase tracking-widest text-xs">Client Name</th>
                  <th className="px-6 py-4 text-left font-medium text-slate-300 uppercase tracking-widest text-xs">Phone</th>
                  <th className="px-6 py-4 text-left font-medium text-slate-300 uppercase tracking-widest text-xs">Destination</th>
                </tr>
              </thead>
              <tbody className="bg-transparent">
                {cancelledDeliveries.map((delivery) => (
                  <tr key={delivery.id} className="bg-white/5 hover:bg-white/10 backdrop-blur-sm transition-all border border-white/10 shadow-lg ">
                    <td className="px-6 py-5 text-sm text-red-400 font-medium">
                      {new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(delivery.cancelledAt))}
                    </td>
                    <td className="px-6 py-5 text-base font-light text-white">
                      {delivery.firstName} {delivery.lastName}
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-400">
                      {delivery.phone}
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-400 max-w-xs truncate" title={delivery.destination}>
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
