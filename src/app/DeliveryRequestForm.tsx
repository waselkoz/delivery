"use client";

import { useRef, useState } from "react";
import { submitDeliveryRequest } from "./actions";
import { Send, CheckCircle, ShieldCheck, Truck } from "lucide-react";
import toast from "react-hot-toast";

export type CustomField = {
  id: string;
  type: "text" | "textarea" | "select";
  label: string;
  options: string[] | string;
  required: boolean;
};

export type FormConfig = {
  phonePlaceholder: string;
  namePlaceholder: string;
  destinationPlaceholder: string;
  customFields: CustomField[];
};

export type LandingPage = {
  id: string;
  title: string;
  subtitle: string;
  buttonText: string;
  formConfig?: FormConfig;
};

export default function DeliveryRequestForm({ page }: { page?: LandingPage }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const isSubmitting = useRef(false);

  async function handleAction(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isSubmitting.current) return;
    
    isSubmitting.current = true;
    const formData = new FormData(e.currentTarget);
    setLoading(true);
    try {
      const result = await submitDeliveryRequest(formData);
      if (result.success) {
        setSuccess(true);
        formRef.current?.reset();
        setTimeout(() => setSuccess(false), 5000);
      } else {
        toast.error("Submission failed: " + (result.error || "Unknown error"));
      }
    } catch (error: unknown) {
      console.error(error);
      toast.error("Error: " + (error instanceof Error ? error.message : "Unknown error"));
    } finally {
      isSubmitting.current = false;
      setLoading(false);
    }
  }

  return (
    <div 
      className="p-8 md:p-10 max-w-lg mx-auto rounded-xl shadow-2xl bg-white border border-gray-100 transition-all duration-500 hover:shadow-3xl relative overflow-hidden"
    >
      <div className="relative z-10">
        {success ? (
          <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in zoom-in duration-500" dir="rtl">
            <div 
              className="w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-lg transform transition-transform hover:scale-110 duration-300 bg-green-50 text-green-500 border-2 border-green-500"
            >
              <CheckCircle className="w-10 h-10" />
            </div>
            <h4 className="text-2xl font-bold tracking-tight mb-2 text-gray-900">تم إرسال الطلب بنجاح!</h4>
            <p className="text-base font-medium text-gray-500">سنتصل بك قريباً.</p>
          </div>
        ) : (
          <form ref={formRef} onSubmit={handleAction} className="space-y-6">
            <div style={{ display: "none" }} aria-hidden="true">
              <label htmlFor="company_website">Website</label>
              <input type="text" name="company_website" id="company_website" tabIndex={-1} autoComplete="off" />
              {page && <input type="hidden" name="landingPageId" value={page.id} />}
            </div>

            <div className="text-center mb-6 relative" dir="rtl">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-4 text-sm font-bold text-gray-900">
                  يرجى ملء النموذج أدناه:
                </span>
              </div>
            </div>

            <div className="space-y-4" dir="rtl">
              <div className="group/input">
                <input 
                  required 
                  type="tel" 
                  name="phone" 
                  id="phone" 
                  className="block w-full bg-white border border-gray-300 rounded-md focus:bg-white transition-all duration-300 px-4 py-3 shadow-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-right" 
                  placeholder={page?.formConfig?.phonePlaceholder || "رقم الهاتف"} 
                />
              </div>
              
              <div className="group/input">
                <input 
                  required 
                  type="text" 
                  name="fullName" 
                  id="fullName" 
                  className="block w-full bg-white border border-gray-300 rounded-md focus:bg-white transition-all duration-300 px-4 py-3 shadow-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-right" 
                  placeholder={page?.formConfig?.namePlaceholder || "الاسم الكامل"}
                />
              </div>
              
              <div className="group/input">
                <select 
                  required 
                  name="wilaya" 
                  id="wilaya" 
                  defaultValue=""
                  className="block w-full bg-white border border-gray-300 rounded-md focus:bg-white transition-all duration-300 px-4 py-3 shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent appearance-none text-right" 
                  dir="rtl"
                >
                  <option value="" disabled>الولاية (اختر ولايتك)</option>
                  <option value="الجزائر (Alger)">الجزائر (Alger)</option>
                  <option value="البليدة (Blida)">البليدة (Blida)</option>
                  <option value="بومرداس (Boumerdas)">بومرداس (Boumerdas)</option>
                  <option value="تيبازة (Tipaza)">تيبازة (Tipaza)</option>
                </select>
              </div>

              <div className="group/input">
                <input 
                  required 
                  type="text"
                  name="address" 
                  id="address" 
                  className="block w-full bg-white border border-gray-300 rounded-md focus:bg-white transition-all duration-300 px-4 py-3 shadow-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-right" 
                  placeholder={page?.formConfig?.destinationPlaceholder || "العنوان بالتفصيل (البلدية، الشارع، المعلم...)"} 
                  dir="rtl"
                />
              </div>

              {page?.formConfig?.customFields?.map((field) => (
                <div key={field.id} className="group/input relative">
                  {field.type === "textarea" ? (
                    <textarea 
                      required={field.required}
                      name={`field_${field.label}`} 
                      id={field.id} 
                      rows={3}
                      className="block w-full bg-white border border-gray-300 rounded-md focus:bg-white transition-all duration-300 px-4 py-3 shadow-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-right" 
                      placeholder={field.label} 
                      dir="rtl"
                    />
                  ) : field.type === "select" ? (
                    <select 
                      required={field.required}
                      name={`field_${field.label}`} 
                      id={field.id} 
                      defaultValue=""
                      className="block w-full bg-white border border-gray-300 rounded-md focus:bg-white transition-all duration-300 px-4 py-3 shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent appearance-none text-right" 
                      dir="rtl"
                    >
                      <option value="" disabled>{field.label}</option>
                      {Array.isArray(field.options) ? field.options.map((opt, i) => (
                        <option key={i} value={opt.trim()}>{opt.trim()}</option>
                      )) : (typeof field.options === 'string' ? field.options.split(',').map((opt, i) => (
                        <option key={i} value={opt.trim()}>{opt.trim()}</option>
                      )) : null)}
                    </select>
                  ) : (
                    <input 
                      required={field.required}
                      type="text" 
                      name={`field_${field.label}`} 
                      id={field.id} 
                      className="block w-full bg-white border border-gray-300 rounded-md focus:bg-white transition-all duration-300 px-4 py-3 shadow-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-right" 
                      placeholder={field.label} 
                      dir="rtl"
                    />
                  )}
                </div>
              ))}
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full flex justify-center items-center py-4 px-6 rounded-md text-lg font-bold text-white transition-all duration-300 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed mt-8 bg-gray-900 hover:bg-gray-800 border-2 border-black"
              style={{
                backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100\' height=\'100\' filter=\'url(%23noise)\' opacity=\'0.08\'/%3E%3C/svg%3E")',
                backgroundColor: '#111827'
              }}
            >
              <span className="relative z-10 flex items-center gap-3">
                {loading ? "جاري الإرسال..." : (page?.buttonText || "إرسال الطلب")}
                {!loading && <Send className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1 rotate-180" />}
              </span>
            </button>

            <div className="flex flex-row-reverse items-center justify-center gap-16 pt-6 mt-6 border-t border-gray-100" dir="rtl">
              <div className="flex flex-col items-center">
                <ShieldCheck className="w-6 h-6 text-gray-800 mb-2" strokeWidth={1.5} />
                <span className="text-xs font-bold text-gray-900 whitespace-nowrap">آمن 100%</span>
              </div>
              <div className="flex flex-col items-center">
                <Truck className="w-6 h-6 text-gray-800 mb-2 transform -scale-x-100" strokeWidth={1.5} />
                <span className="text-xs font-bold text-gray-900 whitespace-nowrap">توصيل سريع</span>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
