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
      className="p-8 md:p-12 max-w-xl mx-auto rounded-none border-[6px] border-black dark:border-white shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] dark:shadow-[16px_16px_0px_0px_rgba(255,255,255,1)] relative overflow-hidden group transition-all duration-300 bg-white dark:bg-gray-900"
    >
      {/* Bold Top Banner */}
      <div 
        className="absolute top-0 left-0 w-full h-4 border-b-[6px] border-black dark:border-white"
        style={{ backgroundColor: config?.primaryColor || "#3b82f6" }}
      />

      <div className="relative z-10 mt-6">
        {success ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div 
              className="w-24 h-24 rounded-none flex items-center justify-center mb-8 border-[6px] border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] transition-transform hover:-translate-y-2 hover:-translate-x-2 hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[16px_16px_0px_0px_rgba(255,255,255,1)]"
              style={{ backgroundColor: config?.primaryColor || "#10b981", color: "#000" }}
            >
              <CheckCircle className="w-12 h-12 stroke-[3]" />
            </div>
            <h4 className="text-4xl font-black tracking-tight mb-4 uppercase" style={{ color: config?.formTextColor || "#111827" }}>Request Sent!</h4>
            <p className="text-xl font-bold" style={{ color: config?.formTextColor || "#4b5563" }}>We will get back to you shortly.</p>
          </div>
        ) : (
          <form ref={formRef} onSubmit={handleAction} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col">
                <label htmlFor="firstName" className="block text-sm font-black uppercase tracking-widest mb-3" style={{ color: config?.formTextColor || "#111827" }}>First Name</label>
                <input 
                  required 
                  type="text" 
                  name="firstName" 
                  id="firstName" 
                  className="block w-full bg-white dark:bg-gray-800 border-4 border-black dark:border-white rounded-none px-5 py-4 font-bold text-lg placeholder-gray-400 focus:outline-none focus:translate-x-1 focus:-translate-y-1 focus:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:focus:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] transition-all duration-200" 
                  style={{ color: config?.formTextColor || "#111827" }}
                  placeholder="John"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="lastName" className="block text-sm font-black uppercase tracking-widest mb-3" style={{ color: config?.formTextColor || "#111827" }}>Last Name</label>
                <input 
                  required 
                  type="text" 
                  name="lastName" 
                  id="lastName" 
                  className="block w-full bg-white dark:bg-gray-800 border-4 border-black dark:border-white rounded-none px-5 py-4 font-bold text-lg placeholder-gray-400 focus:outline-none focus:translate-x-1 focus:-translate-y-1 focus:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:focus:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] transition-all duration-200" 
                  style={{ color: config?.formTextColor || "#111827" }}
                  placeholder="Doe"
                />
              </div>
            </div>
            
            <div className="flex flex-col">
              <label htmlFor="phone" className="block text-sm font-black uppercase tracking-widest mb-3" style={{ color: config?.formTextColor || "#111827" }}>Phone Number</label>
              <input 
                required 
                type="tel" 
                name="phone" 
                id="phone" 
                className="block w-full bg-white dark:bg-gray-800 border-4 border-black dark:border-white rounded-none px-5 py-4 font-bold text-lg placeholder-gray-400 focus:outline-none focus:translate-x-1 focus:-translate-y-1 focus:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:focus:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] transition-all duration-200" 
                style={{ color: config?.formTextColor || "#111827" }}
                placeholder="+1 (555) 000-0000" 
              />
            </div>
            
            <div className="flex flex-col">
              <label htmlFor="destination" className="block text-sm font-black uppercase tracking-widest mb-3" style={{ color: config?.formTextColor || "#111827" }}>Destination Address</label>
              <textarea 
                required 
                name="destination" 
                id="destination" 
                rows={4} 
                className="block w-full bg-white dark:bg-gray-800 border-4 border-black dark:border-white rounded-none px-5 py-4 font-bold text-lg placeholder-gray-400 focus:outline-none focus:translate-x-1 focus:-translate-y-1 focus:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:focus:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] transition-all duration-200 resize-none" 
                style={{ color: config?.formTextColor || "#111827" }}
                placeholder="Where should we deliver?" 
              />
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full flex justify-center items-center py-5 px-8 rounded-none border-[6px] border-black dark:border-white text-2xl font-black uppercase tracking-widest text-black dark:text-gray-900 transition-all duration-200 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:shadow-[12px_12px_0px_0px_rgba(255,255,255,1)] active:shadow-none active:translate-x-3 active:translate-y-3 disabled:opacity-50 disabled:cursor-not-allowed mt-10 hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[16px_16px_0px_0px_rgba(255,255,255,1)]"
              style={{ backgroundColor: config?.primaryColor || "#3b82f6" }}
            >
              <span className="flex items-center">
                {loading ? "Sending..." : (config?.formButtonText || "Submit Request")}
                {!loading && <Send className="ml-4 h-7 w-7 stroke-[3]" />}
              </span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
