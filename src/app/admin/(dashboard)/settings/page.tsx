import { createClient } from "@/lib/supabase/server";
import { updateLandingPageConfig } from "./actions";
import { Save } from "lucide-react";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: config } = await supabase.from('LandingPageConfig').select('*').limit(1).maybeSingle();

  return (
    <div>
      <h1 className="text-3xl font-light tracking-wide text-slate-900 mb-10">Brand</h1>
      
      <div className="bg-white border border-gray-200 shadow-sm p-10 max-w-2xl rounded-none">
        <form action={updateLandingPageConfig} className="space-y-8">
          <h2 className="text-xl font-bold tracking-wide text-slate-900 border-b border-gray-200 pb-4 mb-6 flex items-center gap-2">
            Form Text
          </h2>
          
          <div>
            <label htmlFor="formTitle" className="block text-sm font-bold tracking-wide text-slate-800">
              Form Title
            </label>
            <input
              type="text"
              name="formTitle"
              id="formTitle"
              defaultValue={config?.formTitle || "Ready to Deliver?"}
              className="mt-2 block w-full bg-white border-2 border-gray-300 text-slate-900 font-bold focus:outline-none focus:ring-0 focus:border-slate-900 px-4 py-3 shadow-sm hover:border-gray-400 transition-colors rounded-none"
            />
          </div>

          <div>
            <label htmlFor="formSubtitle" className="block text-sm font-bold tracking-wide text-slate-800">
              Form Subtitle
            </label>
            <textarea
              name="formSubtitle"
              id="formSubtitle"
              rows={2}
              defaultValue={config?.formSubtitle || "Fill out the form below and we'll handle the rest."}
              className="mt-2 block w-full bg-white border-2 border-gray-300 text-slate-900 font-medium focus:outline-none focus:ring-0 focus:border-slate-900 px-4 py-3 shadow-sm hover:border-gray-400 transition-colors rounded-none"
            />
          </div>

          <div>
            <label htmlFor="formButtonText" className="block text-sm font-bold tracking-wide text-slate-800">
              Button Text
            </label>
            <input
              type="text"
              name="formButtonText"
              id="formButtonText"
              defaultValue={config?.formButtonText || "Submit Request"}
              className="mt-2 block w-full bg-white border-2 border-gray-300 text-slate-900 font-bold focus:outline-none focus:ring-0 focus:border-slate-900 px-4 py-3 shadow-sm hover:border-gray-400 transition-colors rounded-none"
            />
          </div>

          <h2 className="text-xl font-bold tracking-wide text-slate-900 border-b border-gray-200 pb-4 mt-12 mb-6 flex items-center gap-2">
            Form Colors
          </h2>
          <div>
            <label htmlFor="primaryColor" className="block text-sm font-bold tracking-wide text-slate-700">
              Submit Button Color (Hex)
            </label>
            <div className="mt-3 flex items-center space-x-4 bg-slate-50 p-2 border border-gray-200">
              <input
                type="color"
                name="primaryColor"
                id="primaryColor"
                defaultValue={config?.primaryColor || "#3b82f6"}
                className="h-10 w-10 cursor-pointer border-0 p-0 m-0 bg-transparent ring-1 ring-gray-200 rounded-none"
              />
              <span className="text-sm font-medium text-slate-700">Button Background</span>
            </div>
          </div>

          <div>
            <label htmlFor="formBackgroundColor" className="block text-sm font-bold tracking-wide text-slate-700">
              Form Box Background Color (Hex)
            </label>
            <div className="mt-3 flex items-center space-x-4 bg-slate-50 p-2 border border-gray-200">
              <input
                type="color"
                name="formBackgroundColor"
                id="formBackgroundColor"
                defaultValue={config?.formBackgroundColor || "#ffffff"}
                className="h-10 w-10 cursor-pointer border-0 p-0 m-0 bg-transparent ring-1 ring-gray-200 rounded-none"
              />
              <span className="text-sm font-medium text-slate-700">Form Box Background</span>
            </div>
          </div>

          <div>
            <label htmlFor="formTextColor" className="block text-sm font-bold tracking-wide text-slate-700">
              Form Text Color (Hex)
            </label>
            <div className="mt-3 flex items-center space-x-4 bg-slate-50 p-2 border border-gray-200">
              <input
                type="color"
                name="formTextColor"
                id="formTextColor"
                defaultValue={config?.formTextColor || "#111827"}
                className="h-10 w-10 cursor-pointer border-0 p-0 m-0 bg-transparent ring-1 ring-gray-200 rounded-none"
              />
              <span className="text-sm font-medium text-slate-700">Main Form Text</span>
            </div>
          </div>

          <div className="pt-6 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center px-8 py-4 font-bold tracking-wide text-white bg-slate-900 hover:bg-black focus:outline-none transition-all shadow-sm hover:shadow-md rounded-none uppercase border-2 border-transparent hover:border-slate-800"
            >
              <Save className="-ml-1 mr-3 h-5 w-5" strokeWidth={2} />
              Save Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
