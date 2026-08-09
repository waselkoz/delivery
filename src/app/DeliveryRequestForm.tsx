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
      className="p-8 md:p-10 max-w-lg mx-auto rounded-none shadow-[16px_16px_30px_-10px_rgba(0,0,0,0.5)] border-4 transition-all duration-300 relative overflow-hidden group"
      style={{ 
        backgroundColor: config?.formBackgroundColor ? `${config.formBackgroundColor}FA` : "rgba(255, 255, 255, 0.98)",
        borderColor: config?.primaryColor || "#000000"
      }}
    >
      {/* Sharp Accent Line */}
      <div 
        className="absolute top-0 left-0 w-full h-2"
        style={{ backgroundColor: config?.primaryColor || "#3b82f6" }}
      />

      <div className="relative z-10 mt-2">
        {success ? (
          <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in duration-500">
            <div 
              className="w-20 h-20 rounded-none flex items-center justify-center mb-6 border-4"
              style={{ borderColor: config?.primaryColor || "#10b981", backgroundColor: `${config?.primaryColor || "#10b981"}10`, color: config?.primaryColor || "#10b981" }}
            >
              <CheckCircle className="w-10 h-10" />
            </div>
            <h4 className="text-2xl font-bold tracking-tight mb-2 uppercase" style={{ color: config?.formTextColor || "#111827" }}>Request Sent!</h4>
            <p className="text-base font-medium" style={{ color: config?.formTextColor || "#4b5563", opacity: 0.9 }}>We will get back to you shortly.</p>
          </div>
        ) : (
          <form ref={formRef} onSubmit={handleAction} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group/input">
                <label htmlFor="firstName" className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: config?.formTextColor || "#111827" }}>First Name</label>
                <input 
                  required 
                  type="text" 
                  name="firstName" 
                  id="firstName" 
                  className="block w-full bg-white dark:bg-gray-900 border-2 rounded-none transition-all duration-200 px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-0" 
                  style={{ borderColor: "rgba(156, 163, 175, 0.5)", color: config?.formTextColor || "#111827", borderBottomColor: config?.primaryColor || "#000" } as React.CSSProperties} 
                  placeholder="John"
                  onFocus={(e) => e.target.style.borderColor = config?.primaryColor || "#000"}
                  onBlur={(e) => { e.target.style.borderColor = "rgba(156, 163, 175, 0.5)"; e.target.style.borderBottomColor = config?.primaryColor || "#000"; }}
                />
              </div>
              <div className="group/input">
                <label htmlFor="lastName" className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: config?.formTextColor || "#111827" }}>Last Name</label>
                <input 
                  required 
                  type="text" 
                  name="lastName" 
                  id="lastName" 
                  className="block w-full bg-white dark:bg-gray-900 border-2 rounded-none transition-all duration-200 px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-0" 
                  style={{ borderColor: "rgba(156, 163, 175, 0.5)", color: config?.formTextColor || "#111827", borderBottomColor: config?.primaryColor || "#000" } as React.CSSProperties} 
                  placeholder="Doe"
                  onFocus={(e) => e.target.style.borderColor = config?.primaryColor || "#000"}
                  onBlur={(e) => { e.target.style.borderColor = "rgba(156, 163, 175, 0.5)"; e.target.style.borderBottomColor = config?.primaryColor || "#000"; }}
                />
              </div>
            </div>
            
            <div className="group/input">
              <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: config?.formTextColor || "#111827" }}>Phone Number</label>
              <input 
                required 
                type="tel" 
                name="phone" 
                id="phone" 
                className="block w-full bg-white dark:bg-gray-900 border-2 rounded-none transition-all duration-200 px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-0" 
                style={{ borderColor: "rgba(156, 163, 175, 0.5)", color: config?.formTextColor || "#111827", borderBottomColor: config?.primaryColor || "#000" } as React.CSSProperties} 
                placeholder="+1 (555) 000-0000" 
                onFocus={(e) => e.target.style.borderColor = config?.primaryColor || "#000"}
                onBlur={(e) => { e.target.style.borderColor = "rgba(156, 163, 175, 0.5)"; e.target.style.borderBottomColor = config?.primaryColor || "#000"; }}
              />
            </div>
            
            <div className="group/input">
              <label htmlFor="destination" className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: config?.formTextColor || "#111827" }}>Destination Address</label>
              <textarea 
                required 
                name="destination" 
                id="destination" 
                rows={3} 
                className="block w-full bg-white dark:bg-gray-900 border-2 rounded-none transition-all duration-200 px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-0 resize-none" 
                style={{ borderColor: "rgba(156, 163, 175, 0.5)", color: config?.formTextColor || "#111827", borderBottomColor: config?.primaryColor || "#000" } as React.CSSProperties} 
                placeholder="Where should we deliver?" 
                onFocus={(e) => e.target.style.borderColor = config?.primaryColor || "#000"}
                onBlur={(e) => { e.target.style.borderColor = "rgba(156, 163, 175, 0.5)"; e.target.style.borderBottomColor = config?.primaryColor || "#000"; }}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full flex justify-center items-center py-4 px-6 rounded-none border-4 text-lg font-black uppercase tracking-widest text-white transition-all duration-200 transform hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none disabled:opacity-70 disabled:hover:translate-y-0 disabled:cursor-not-allowed mt-8 relative overflow-hidden"
              style={{ backgroundColor: config?.primaryColor || "#000", borderColor: "#000" }}
            >
              <span className="relative z-10 flex items-center">
                {loading ? "Sending..." : (config?.formButtonText || "Submit Request")}
                {!loading && <Send className="ml-3 h-6 w-6 transition-transform duration-200 group-hover:translate-x-1" />}
              </span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
