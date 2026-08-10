import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus, Edit2, ExternalLink, Globe, Trash2 } from "lucide-react";
import { deleteLandingPage } from "./actions";

export default async function PagesManager() {
  const supabase = await createClient();
  const { data: pages } = await supabase.from('LandingPage').select('*').order('createdAt', { ascending: false });

  return (
    <div>
      <div className="flex justify-between items-center mb-8" dir="rtl">
        <h1 className="text-3xl font-light tracking-wide text-slate-900 flex items-center gap-3">
          <Globe className="text-slate-400" />
          إدارة الصفحات
        </h1>
        <Link 
          href="/admin/dashboard/pages/create" 
          className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-none font-medium transition-colors"
        >
          <Plus size={18} />
          إنشاء صفحة جديدة
        </Link>
      </div>

      <div className="bg-white border border-gray-200 shadow-sm rounded-none overflow-hidden" dir="rtl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead className="bg-slate-50 border-b border-gray-200 text-slate-600 font-medium">
              <tr>
                <th className="px-6 py-4">العنوان</th>
                <th className="px-6 py-4">الرابط</th>
                <th className="px-6 py-4">تاريخ الإنشاء</th>
                <th className="px-6 py-4 text-left">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pages?.map((page) => (
                <tr key={page.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900">{page.title}</td>
                  <td className="px-6 py-4 font-mono text-slate-500 text-right" dir="ltr">/{page.slug}</td>
                  <td className="px-6 py-4 text-slate-500">
                    {new Date(page.createdAt).toLocaleDateString('en-US')}
                  </td>
                  <td className="px-6 py-4 text-left">
                    <div className="flex justify-end gap-3 flex-row-reverse">
                      <Link 
                        href={`/admin/dashboard/pages/${page.id}`}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors rounded-full"
                        title="تعديل"
                      >
                        <Edit2 size={18} />
                      </Link>
                      <a 
                        href={`/${page.slug}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors rounded-full"
                        title="عرض الصفحة"
                      >
                        <ExternalLink size={18} />
                      </a>
                      <form action={async () => {
                        "use server";
                        await deleteLandingPage(page.id);
                      }}>
                        <button 
                          type="submit"
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors rounded-full"
                          title="حذف الصفحة"
                        >
                          <Trash2 size={18} />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
              {!pages || pages.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                    لا توجد صفحات بعد. أنشئ صفحتك الأولى.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
