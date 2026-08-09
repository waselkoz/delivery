"use client";

import { useRef, useState } from "react";
import { submitDeliveryRequest } from "./actions";
import { Send, CheckCircle } from "lucide-react";

type LandingPageConfig = {
  id: string;
  primaryColor: string;
  formTitle: string;
  formSubtitle: string;
  formButtonText: string;
  formBackgroundColor: string;
  formTextColor: string;
};

export default function DeliveryRequestForm({ config }: { config: LandingPageConfig | null }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleAction(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setLoading(true);
    try {
      const result = await submitDeliveryRequest(formData);
      if (result.success) {
        setSuccess(true);
        formRef.current?.reset();
        setTimeout(() => setSuccess(false), 5000);
      } else {
        alert("Submission failed: " + (result.error || "Unknown error"));
      }
    } catch (error: unknown) {
      console.error(error);
      alert("Error: " + (error instanceof Error ? error.message : "Unknown error"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div 
      className="p-8 md:p-12 max-w-lg mx-auto rounded-none shadow-[0_20px_60px_-10px_rgba(0,0,0,0.8)] dark:shadow-[0_20px_60px_-10px_rgba(255,255,255,0.2)] border-[6px] transition-all duration-300 relative z-10"
      style={{ 
        backgroundColor: config?.formBackgroundColor || "#ffffff",
        borderColor: config?.primaryColor || "#000000"
      }}
    >
      <div className="relative z-10">
        {success ? (
          <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in zoom-in duration-500">
            <div 
              className="w-24 h-24 rounded-none flex items-center justify-center mb-6 shadow-lg border-[6px]"
              style={{ borderColor: config?.primaryColor || "#10b981", backgroundColor: `${config?.primaryColor || "#10b981"}20`, color: config?.primaryColor || "#10b981" }}
            >
              <CheckCircle className="w-12 h-12" />
            </div>
            <h4 className="text-3xl font-black tracking-tighter mb-2 uppercase" style={{ color: config?.formTextColor || "#111827" }}>Request Sent!</h4>
            <p className="text-lg font-bold" style={{ color: config?.formTextColor || "#4b5563" }}>We will get back to you shortly.</p>
          </div>
        ) : (
          <form ref={formRef} onSubmit={handleAction} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group/input">
                <label htmlFor="firstName" className="block text-sm font-black uppercase tracking-widest mb-2" style={{ color: config?.formTextColor || "#111827" }}>First Name</label>
                <input 
                  required 
                  type="text" 
                  name="firstName" 
                  id="firstName" 
                  className="block w-full bg-white dark:bg-gray-900 border-4 border-gray-300 dark:border-gray-700 rounded-none transition-all duration-200 px-5 py-4 placeholder-gray-400 focus:outline-none focus:ring-0 text-lg font-bold" 
                  style={{ color: config?.formTextColor || "#111827" }} 
                  placeholder="John"
                  onFocus={(e) => e.target.style.borderColor = config?.primaryColor || "#000"}
                  onBlur={(e) => e.target.style.borderColor = ""}
                />
              </div>
              <div className="group/input">
                <label htmlFor="lastName" className="block text-sm font-black uppercase tracking-widest mb-2" style={{ color: config?.formTextColor || "#111827" }}>Last Name</label>
                <input 
                  required 
                  type="text" 
                  name="lastName" 
                  id="lastName" 
                  className="block w-full bg-white dark:bg-gray-900 border-4 border-gray-300 dark:border-gray-700 rounded-none transition-all duration-200 px-5 py-4 placeholder-gray-400 focus:outline-none focus:ring-0 text-lg font-bold" 
                  style={{ color: config?.formTextColor || "#111827" }} 
                  placeholder="Doe"
                  onFocus={(e) => e.target.style.borderColor = config?.primaryColor || "#000"}
                  onBlur={(e) => e.target.style.borderColor = ""}
                />
              </div>
            </div>
            
            <div className="group/input">
              <label htmlFor="phone" className="block text-sm font-black uppercase tracking-widest mb-2" style={{ color: config?.formTextColor || "#111827" }}>Phone Number</label>
              <input 
                required 
                type="tel" 
                name="phone" 
                id="phone" 
                className="block w-full bg-white dark:bg-gray-900 border-4 border-gray-300 dark:border-gray-700 rounded-none transition-all duration-200 px-5 py-4 placeholder-gray-400 focus:outline-none focus:ring-0 text-lg font-bold" 
                style={{ color: config?.formTextColor || "#111827" }} 
                placeholder="+1 (555) 000-0000" 
                onFocus={(e) => e.target.style.borderColor = config?.primaryColor || "#000"}
                onBlur={(e) => e.target.style.borderColor = ""}
              />
            </div>
            
            <div className="group/input">
              <label htmlFor="destination" className="block text-sm font-black uppercase tracking-widest mb-2" style={{ color: config?.formTextColor || "#111827" }}>Destination Address</label>
              <textarea 
                required 
                name="destination" 
                id="destination" 
                rows={4} 
                className="block w-full bg-white dark:bg-gray-900 border-4 border-gray-300 dark:border-gray-700 rounded-none transition-all duration-200 px-5 py-4 placeholder-gray-400 focus:outline-none focus:ring-0 text-lg font-bold resize-none" 
                style={{ color: config?.formTextColor || "#111827" }} 
                placeholder="Where should we deliver?" 
                onFocus={(e) => e.target.style.borderColor = config?.primaryColor || "#000"}
                onBlur={(e) => e.target.style.borderColor = ""}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full flex justify-center items-center py-5 px-6 rounded-none text-xl font-black uppercase tracking-widest text-white transition-all duration-300 transform hover:-translate-y-1 active:translate-y-1 hover:shadow-2xl disabled:opacity-70 disabled:hover:translate-y-0 disabled:active:scale-100 disabled:cursor-not-allowed mt-8 border-4 border-transparent hover:border-white/20"
              style={{ backgroundColor: config?.primaryColor || "#000000" }}
            >
              <span className="relative z-10 flex items-center">
                {loading ? "Sending..." : (config?.formButtonText || "Submit Request")}
                {!loading && <Send className="ml-4 h-6 w-6 transition-transform duration-300 group-hover:translate-x-2" />}
              </span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
