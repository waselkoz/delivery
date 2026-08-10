import { createClient } from "@/lib/supabase/server";
import DeliveryStatusSelect from "./DeliveryStatusSelect";
import Link from "next/link";
import { Filter, ExternalLink } from "lucide-react";

type DeliveryRequest = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  destination: string;
  landingPageId?: string | null;
  LandingPage?: {
    slug: string;
    title: string;
  };
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  cancelledAt?: string;
  customData?: any;
};

export default async function DeliveriesPage({ searchParams }: { searchParams: Promise<{ pageId?: string }> }) {
  const supabase = await createClient();
  const unwrappedParams = await searchParams;
  const pageId = unwrappedParams.pageId;

  let deliveriesQuery = supabase.from('DeliveryRequest').select('*, LandingPage(slug, title)').order('createdAt', { ascending: false });
  let completedQuery = supabase.from('CompletedDelivery').select('*, LandingPage(slug, title)').order('completedAt', { ascending: false });

  if (pageId) {
    deliveriesQuery = deliveriesQuery.eq('landingPageId', pageId);
    completedQuery = completedQuery.eq('landingPageId', pageId);
  }

  const [
    { data: deliveriesData },
    { data: completedDeliveriesData },
    { data: pagesData }
  ] = await Promise.all([
    deliveriesQuery,
    completedQuery,
    supabase.from('LandingPage').select('id, title, slug').order('createdAt', { ascending: false })
  ]);

  const deliveries = deliveriesData || [];
  const completedDeliveries = completedDeliveriesData || [];
  const pages = pagesData || [];

  return (
    <div>
      <div className="flex justify-between items-center mb-10" dir="rtl">
        <h1 className="text-3xl font-light tracking-wide text-slate-900">الطلبيات</h1>
      </div>

      <div className="bg-white border border-gray-200 shadow-sm p-4 mb-8 flex flex-row-reverse items-center gap-4 overflow-x-auto" dir="rtl">
        <Filter className="text-slate-400 shrink-0" size={20} />
        <span className="font-bold text-slate-700 shrink-0">تصفية حسب المصدر:</span>
        <div className="flex flex-nowrap gap-2 min-w-max flex-row-reverse">
          <Link 
            href="/admin/dashboard/deliveries"
            className={`px-4 py-2 text-sm font-medium border ${!pageId ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-gray-200 hover:bg-slate-50'}`}
          >
            جميع المصادر
          </Link>
          <Link 
            href="?pageId=null"
            className={`px-4 py-2 text-sm font-medium border ${pageId === 'null' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-gray-200 hover:bg-slate-50'}`}
          >
            الافتراضي (الصفحة الرئيسية)
          </Link>
          {pages.map(p => (
            <Link 
              key={p.id}
              href={`?pageId=${p.id}`}
              className={`px-4 py-2 text-sm font-medium border ${pageId === p.id ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-gray-200 hover:bg-slate-50'}`}
            >
              {p.title} (/{p.slug})
            </Link>
          ))}
        </div>
      </div>

      <div className="bg-white border border-gray-200 shadow-sm rounded-none mb-12 overflow-hidden" dir="rtl">
        <div className="px-8 py-6 bg-slate-50 border-b border-gray-200">
          <h3 className="text-lg font-bold tracking-wide text-slate-900">قائمة الانتظار</h3>
        </div>
        
        {deliveries.length === 0 ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            لم يتم العثور على أي طلبات توصيل.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-3 px-4 text-right">
              <thead className="bg-slate-100/50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-5 font-bold text-slate-700 uppercase tracking-widest text-xs">التاريخ</th>
                  <th className="px-6 py-5 font-bold text-slate-700 uppercase tracking-widest text-xs">اسم العميل</th>
                  <th className="px-6 py-5 font-bold text-slate-700 uppercase tracking-widest text-xs">رقم الهاتف</th>
                  <th className="px-6 py-5 font-bold text-slate-700 uppercase tracking-widest text-xs">الوجهة</th>
                  <th className="px-6 py-5 font-bold text-slate-700 uppercase tracking-widest text-xs">إضافات</th>
                  <th className="px-6 py-5 font-bold text-slate-700 uppercase tracking-widest text-xs">المصدر</th>
                  <th className="px-6 py-5 font-bold text-slate-700 uppercase tracking-widest text-xs">الحالة</th>
                  <th className="px-6 py-5 text-right font-bold text-slate-700 uppercase tracking-widest text-xs">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {deliveries.map((delivery: DeliveryRequest) => (
                  <tr key={delivery.id} className="hover:bg-slate-50 transition-colors border-b border-gray-100 last:border-0">
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
                    <td className="px-6 py-5 text-sm text-slate-600 min-w-[150px]">
                      {delivery.customData && Object.keys(delivery.customData).length > 0 ? (
                        <div className="space-y-1">
                          {Object.entries(delivery.customData).map(([key, val]) => (
                            <div key={key} className="text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded border border-gray-200">
                              <span className="font-bold mr-1">{key}:</span>
                              {String(val)}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs italic">None</span>
                      )}
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-600">
                      {delivery.LandingPage ? (
                        <div className="flex items-center justify-end gap-1">
                          <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-1 text-xs rounded-sm font-medium">
                            {delivery.LandingPage.title}
                          </span>
                          <a href={`/${delivery.LandingPage.slug}`} target="_blank" className="text-slate-400 hover:text-blue-600 transition-colors" title={`/${delivery.LandingPage.slug}`}>
                            <ExternalLink size={14} />
                          </a>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs italic">افتراضي</span>
                      )}
                    </td>
                    <td className="px-6 py-5">
                      <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-widest border text-yellow-400 bg-yellow-500/10 border-yellow-500/20">
                        قيد الانتظار
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
      <div className="bg-white border border-gray-200 shadow-sm rounded-none mb-12 overflow-hidden" dir="rtl">
        <div className="px-8 py-6 bg-slate-50 border-b border-gray-200 flex items-center justify-between flex-row-reverse">
          <h3 className="text-lg font-bold tracking-wide text-slate-900">الطلبيات المكتملة</h3>
          <span className="text-emerald-700 bg-emerald-100 border border-emerald-200 px-3 py-1 text-xs font-bold uppercase tracking-widest">{completedDeliveries.length} سجلات</span>
        </div>
        
        {completedDeliveries.length === 0 ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            لا توجد طلبيات مكتملة بعد.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-3 px-4 text-right">
              <thead className="bg-slate-100/50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-5 font-bold text-slate-700 uppercase tracking-widest text-xs">تاريخ الانتهاء</th>
                  <th className="px-6 py-5 font-bold text-slate-700 uppercase tracking-widest text-xs">اسم العميل</th>
                  <th className="px-6 py-5 font-bold text-slate-700 uppercase tracking-widest text-xs">رقم الهاتف</th>
                  <th className="px-6 py-5 font-bold text-slate-700 uppercase tracking-widest text-xs">الوجهة</th>
                  <th className="px-6 py-5 font-bold text-slate-700 uppercase tracking-widest text-xs">إضافات</th>
                  <th className="px-6 py-5 font-bold text-slate-700 uppercase tracking-widest text-xs">المصدر</th>
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
                    <td className="px-6 py-5 text-sm text-slate-600 min-w-[150px]">
                      {delivery.customData && Object.keys(delivery.customData).length > 0 ? (
                        <div className="space-y-1">
                          {Object.entries(delivery.customData).map(([key, val]) => (
                            <div key={key} className="text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded border border-gray-200">
                              <span className="font-bold mr-1">{key}:</span>
                              {String(val)}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs italic">None</span>
                      )}
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-600">
                      {delivery.LandingPage ? (
                        <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-1 text-xs rounded-sm font-medium">
                          {delivery.LandingPage.title}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs italic">Default</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
    </div>
  );
}
