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
      className="p-8 md:p-10 max-w-lg mx-auto rounded-3xl backdrop-blur-xl shadow-2xl border transition-all duration-500 hover:shadow-3xl relative overflow-hidden group"
      style={{ 
        backgroundColor: config?.formBackgroundColor ? `${config.formBackgroundColor}dd` : "rgba(255, 255, 255, 0.85)",
        borderColor: config?.primaryColor ? `${config.primaryColor}20` : "rgba(255, 255, 255, 0.2)"
      }}
    >
      {/* Subtle background glow effect */}
      <div 
        className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl opacity-20 transition-opacity duration-500 group-hover:opacity-40"
        style={{ backgroundColor: config?.primaryColor || "#3b82f6" }}
      />
      <div 
        className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full blur-3xl opacity-20 transition-opacity duration-500 group-hover:opacity-40"
        style={{ backgroundColor: config?.primaryColor || "#3b82f6" }}
      />

      <div className="relative z-10">
        {success ? (
          <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in zoom-in duration-500">
            <div 
              className="w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-lg transform transition-transform hover:scale-110 duration-300"
              style={{ backgroundColor: `${config?.primaryColor || "#10b981"}20`, color: config?.primaryColor || "#10b981" }}
            >
              <CheckCircle className="w-10 h-10" />
            </div>
            <h4 className="text-2xl font-bold tracking-tight mb-2" style={{ color: config?.formTextColor || "#111827" }}>Request Sent!</h4>
            <p className="text-base" style={{ color: config?.formTextColor || "#4b5563", opacity: 0.85 }}>We will get back to you shortly.</p>
          </div>
        ) : (
          <form ref={formRef} onSubmit={handleAction} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group/input">
                <label htmlFor="firstName" className="block text-sm font-medium mb-2 transition-colors duration-200" style={{ color: config?.formTextColor || "#374151" }}>First Name</label>
                <input 
                  required 
                  type="text" 
                  name="firstName" 
                  id="firstName" 
                  className="block w-full bg-black/5 dark:bg-white/5 border border-transparent rounded-xl focus:bg-transparent transition-all duration-300 px-4 py-3 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent" 
                  style={{ '--tw-ring-color': config?.primaryColor || "#3b82f6", color: config?.formTextColor || "#111827" } as React.CSSProperties} 
                  placeholder="John"
                />
              </div>
              <div className="group/input">
                <label htmlFor="lastName" className="block text-sm font-medium mb-2 transition-colors duration-200" style={{ color: config?.formTextColor || "#374151" }}>Last Name</label>
                <input 
                  required 
                  type="text" 
                  name="lastName" 
                  id="lastName" 
                  className="block w-full bg-black/5 dark:bg-white/5 border border-transparent rounded-xl focus:bg-transparent transition-all duration-300 px-4 py-3 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent" 
                  style={{ '--tw-ring-color': config?.primaryColor || "#3b82f6", color: config?.formTextColor || "#111827" } as React.CSSProperties} 
                  placeholder="Doe"
                />
              </div>
            </div>
            
            <div className="group/input">
              <label htmlFor="phone" className="block text-sm font-medium mb-2 transition-colors duration-200" style={{ color: config?.formTextColor || "#374151" }}>Phone Number</label>
              <input 
                required 
                type="tel" 
                name="phone" 
                id="phone" 
                className="block w-full bg-black/5 dark:bg-white/5 border border-transparent rounded-xl focus:bg-transparent transition-all duration-300 px-4 py-3 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent" 
                style={{ '--tw-ring-color': config?.primaryColor || "#3b82f6", color: config?.formTextColor || "#111827" } as React.CSSProperties} 
                placeholder="+1 (555) 000-0000" 
              />
            </div>
            
            <div className="group/input">
              <label htmlFor="destination" className="block text-sm font-medium mb-2 transition-colors duration-200" style={{ color: config?.formTextColor || "#374151" }}>Destination Address</label>
              <textarea 
                required 
                name="destination" 
                id="destination" 
                rows={3} 
                className="block w-full bg-black/5 dark:bg-white/5 border border-transparent rounded-xl focus:bg-transparent transition-all duration-300 px-4 py-3 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent resize-none" 
                style={{ '--tw-ring-color': config?.primaryColor || "#3b82f6", color: config?.formTextColor || "#111827" } as React.CSSProperties} 
                placeholder="Where should we deliver?" 
              />
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full flex justify-center items-center py-4 px-6 rounded-xl text-lg font-semibold text-white transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl active:scale-[0.98] disabled:opacity-70 disabled:hover:translate-y-0 disabled:active:scale-100 disabled:cursor-not-allowed mt-8 relative overflow-hidden"
              style={{ backgroundColor: config?.primaryColor || "#3b82f6" }}
            >
              <div className="absolute inset-0 bg-white/20 hover:bg-transparent transition-colors duration-300 mix-blend-overlay rounded-xl"></div>
              <span className="relative z-10 flex items-center">
                {loading ? "Sending..." : (config?.formButtonText || "Submit Request")}
                {!loading && <Send className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />}
              </span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
