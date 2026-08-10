import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

export const revalidate = 60;

export default async function Home() {
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  
  const { data: landingPage } = await supabase
    .from('LandingPage')
    .select('slug')
    .order('createdAt', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (landingPage) {
    redirect(`/${landingPage.slug}`);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center font-sans text-center px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">لا توجد صفحات نشطة</h1>
      <p className="text-gray-500 mb-8 max-w-md">يرجى تسجيل الدخول إلى لوحة القيادة لإنشاء صفحتك الأولى.</p>
      <a href="/admin" className="bg-slate-900 text-white px-6 py-3 rounded-md font-bold hover:bg-slate-800 transition-colors" dir="rtl">
        الذهاب إلى لوحة الإدارة
      </a>
    </div>
  );
}
