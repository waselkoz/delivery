import { createClient } from "@/lib/supabase/server";
import { updateLandingPageConfig } from "./actions";
import { Save } from "lucide-react";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: config } = await supabase.from('LandingPageConfig').select('*').limit(1).maybeSingle();

  return (
    <div>
      <h1 className="text-3xl font-light tracking-wide text-white mb-10">Brand</h1>
      
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl  p-10 max-w-2xl">
        <form action={updateLandingPageConfig} className="space-y-8">
          <h2 className="text-xl font-light tracking-wide text-white border-b border-white/10 pb-4 mb-6 flex items-center gap-2">
            <span className="w-1.5 h-1.5  bg-indigo-500"></span>
            Form Text
          </h2>
          
          <div>
            <label htmlFor="formTitle" className="block text-sm font-medium tracking-wide text-slate-300">
              Form Title
            </label>
            <input
              type="text"
              name="formTitle"
              id="formTitle"
              defaultValue={config?.formTitle || "Ready to Deliver?"}
              className="mt-2 block w-full bg-white/5 border border-white/10  text-white font-light focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 px-4 py-3 shadow-inner transition-all"
            />
          </div>

          <div>
            <label htmlFor="formSubtitle" className="block text-sm font-medium tracking-wide text-slate-300">
              Form Subtitle
            </label>
            <textarea
              name="formSubtitle"
              id="formSubtitle"
              rows={2}
              defaultValue={config?.formSubtitle || "Fill out the form below and we'll handle the rest."}
              className="mt-2 block w-full bg-white/5 border border-white/10  text-white font-light focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 px-4 py-3 shadow-inner transition-all"
            />
          </div>

          <div>
            <label htmlFor="formButtonText" className="block text-sm font-medium tracking-wide text-slate-300">
              Button Text
            </label>
            <input
              type="text"
              name="formButtonText"
              id="formButtonText"
              defaultValue={config?.formButtonText || "Submit Request"}
              className="mt-2 block w-full bg-white/5 border border-white/10  text-white font-light focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 px-4 py-3 shadow-inner transition-all"
            />
          </div>

          <h2 className="text-xl font-light tracking-wide text-white border-b border-white/10 pb-4 mt-12 mb-6 flex items-center gap-2">
            <span className="w-1.5 h-1.5  bg-fuchsia-500"></span>
            Form Colors
          </h2>
          <div>
            <label htmlFor="primaryColor" className="block text-sm font-medium tracking-wide text-slate-300">
              Submit Button Color (Hex)
            </label>
            <div className="mt-3 flex items-center space-x-4 bg-white/5 p-2  border border-white/10">
              <input
                type="color"
                name="primaryColor"
                id="primaryColor"
                defaultValue={config?.primaryColor || "#3b82f6"}
                className="h-10 w-10  cursor-pointer border-0 p-0 m-0 bg-transparent ring-1 ring-white/20"
              />
              <span className="text-sm font-light text-slate-300">Button Background</span>
            </div>
          </div>

          <div>
            <label htmlFor="formBackgroundColor" className="block text-sm font-medium tracking-wide text-slate-300">
              Form Box Background Color (Hex)
            </label>
            <div className="mt-3 flex items-center space-x-4 bg-white/5 p-2  border border-white/10">
              <input
                type="color"
                name="formBackgroundColor"
                id="formBackgroundColor"
                defaultValue={config?.formBackgroundColor || "#ffffff"}
                className="h-10 w-10  cursor-pointer border-0 p-0 m-0 bg-transparent ring-1 ring-white/20"
              />
              <span className="text-sm font-light text-slate-300">Form Box Background</span>
            </div>
          </div>

          <div>
            <label htmlFor="formTextColor" className="block text-sm font-medium tracking-wide text-slate-300">
              Form Text Color (Hex)
            </label>
            <div className="mt-3 flex items-center space-x-4 bg-white/5 p-2  border border-white/10">
              <input
                type="color"
                name="formTextColor"
                id="formTextColor"
                defaultValue={config?.formTextColor || "#111827"}
                className="h-10 w-10  cursor-pointer border-0 p-0 m-0 bg-transparent ring-1 ring-white/20"
              />
              <span className="text-sm font-light text-slate-300">Main Form Text</span>
            </div>
          </div>

          <div className="pt-6 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center px-8 py-4  font-medium tracking-wide text-white bg-indigo-500 hover:bg-indigo-600 focus:outline-none transition-all shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)]"
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
