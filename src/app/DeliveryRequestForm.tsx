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
      className="p-8 max-w-lg mx-auto border-4 border-gray-900 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all"
      style={{ backgroundColor: config?.formBackgroundColor || "#ffffff" }}
    >
      
      {success ? (
        <div className="flex flex-col items-center justify-center py-8 text-center animate-fade-in-up">
          <CheckCircle className="w-16 h-16 mb-4" style={{ color: config?.primaryColor || "#000000" }} />
          <h4 className="text-xl font-bold" style={{ color: config?.formTextColor || "#111827" }}>Request Sent!</h4>
          <p className="mt-2" style={{ color: config?.formTextColor || "#111827", opacity: 0.8 }}>We will get back to you shortly.</p>
        </div>
      ) : (
        <form ref={formRef} onSubmit={handleAction} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label htmlFor="firstName" className="block text-sm font-bold mb-2 uppercase tracking-wide" style={{ color: config?.formTextColor || "#111827" }}>First Name</label>
              <input required type="text" name="firstName" id="firstName" className="block w-full border-2 border-gray-900 bg-white text-gray-900 focus:outline-none focus:ring-4 transition-all px-4 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" style={{ '--tw-ring-color': config?.primaryColor || "#000000" } as React.CSSProperties} />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-bold mb-2 uppercase tracking-wide" style={{ color: config?.formTextColor || "#111827" }}>Last Name</label>
              <input required type="text" name="lastName" id="lastName" className="block w-full border-2 border-gray-900 bg-white text-gray-900 focus:outline-none focus:ring-4 transition-all px-4 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" style={{ '--tw-ring-color': config?.primaryColor || "#000000" } as React.CSSProperties} />
            </div>
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-bold mb-2 uppercase tracking-wide" style={{ color: config?.formTextColor || "#111827" }}>Phone Number</label>
            <input required type="tel" name="phone" id="phone" className="block w-full border-2 border-gray-900 bg-white text-gray-900 focus:outline-none focus:ring-4 transition-all px-4 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" style={{ '--tw-ring-color': config?.primaryColor || "#000000" } as React.CSSProperties} placeholder="+1 (555) 000-0000" />
          </div>
          
          <div>
            <label htmlFor="destination" className="block text-sm font-bold mb-2 uppercase tracking-wide" style={{ color: config?.formTextColor || "#111827" }}>Where to? (Destination Address)</label>
            <textarea required name="destination" id="destination" rows={3} className="block w-full border-2 border-gray-900 bg-white text-gray-900 focus:outline-none focus:ring-4 transition-all px-4 py-3 resize-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" style={{ '--tw-ring-color': config?.primaryColor || "#000000" } as React.CSSProperties} placeholder="Enter the full delivery address" />
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full flex justify-center items-center py-4 px-4 border-2 border-gray-900 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-xl font-bold text-white transition-all transform active:translate-y-1 active:translate-x-1 active:shadow-none disabled:opacity-50 hover:bg-opacity-90 uppercase tracking-widest mt-4"
            style={{ backgroundColor: config?.primaryColor || "#000000" }}
          >
            {loading ? "Sending..." : (config?.formButtonText || "Submit Request")}
            {!loading && <Send className="ml-2 h-5 w-5" />}
          </button>
        </form>
      )}
    </div>
  );
}
