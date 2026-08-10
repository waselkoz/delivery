"use client";

import { useState } from "react";
import { createLandingPage } from "../actions";
import { ArrowRight, Save, Link as LinkIcon, Type, AlignLeft } from "lucide-react";
import Link from "next/link";
import FormBuilder from "../FormBuilder";

export default function CreatePage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    
    try {
      const result = await createLandingPage(formData);
      if (result?.error) {
        setError(result.error);
        setLoading(false);
      }
    } catch (err) {
      setError("An unexpected error occurred");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-8" dir="ltr">
        <Link href="/admin/dashboard/pages" className="text-slate-400 hover:text-slate-900 transition-colors p-2 rounded-full hover:bg-gray-100">
          <ArrowRight size={24} className="transform rotate-180" />
        </Link>
        <h1 className="text-3xl font-light tracking-wide text-slate-900">Créer une nouvelle page</h1>
      </div>

      <div className="bg-white border border-gray-200 shadow-sm rounded-none p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-500 p-4 rounded-md text-sm font-medium border border-red-100">
              {error}
            </div>
          )}

          <div className="space-y-2" dir="ltr">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <LinkIcon size={16} className="text-slate-400" />
              Lien de la page (Slug)
            </label>
            <div className="flex items-center">
              <span className="bg-slate-50 border border-gray-300 border-r-0 px-4 py-2.5 text-slate-500 rounded-l-md font-mono text-sm">
                /
              </span>
              <input 
                required
                type="text"
                name="slug"
                placeholder="summer-campaign"
                className="flex-1 bg-white border border-gray-300 px-4 py-2.5 rounded-r-md focus:outline-none focus:ring-2 focus:ring-slate-900 font-mono text-sm text-left"
                dir="ltr"
              />
            </div>
            <p className="text-xs text-slate-500">Doit être en minuscules anglaises sans espaces, ex: shoes-promo</p>
          </div>

          <div className="space-y-2" dir="ltr">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <Type size={16} className="text-slate-400" />
              Titre principal
            </label>
            <input 
              required
              type="text"
              name="title"
              placeholder="Commandez maintenant"
              className="w-full bg-white border border-gray-300 px-4 py-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div className="space-y-2" dir="ltr">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <AlignLeft size={16} className="text-slate-400" />
              Sous-titre
            </label>
            <input 
              required
              type="text"
              name="subtitle"
              placeholder="Remplissez le formulaire ci-dessous et nous nous occupons du reste."
              className="w-full bg-white border border-gray-300 px-4 py-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div className="space-y-2" dir="ltr">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <Type size={16} className="text-slate-400" />
              Texte du bouton d'envoi
            </label>
            <input 
              required
              type="text"
              name="buttonText"
              defaultValue="Envoyer la commande"
              className="w-full bg-white border border-gray-300 px-4 py-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <FormBuilder />

          <div className="pt-6 border-t border-gray-100 flex justify-start" dir="ltr">
            <button 
              type="submit"
              disabled={loading}
              className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-md font-medium transition-colors flex items-center gap-2 disabled:opacity-50 flex-row"
            >
              <Save size={18} />
              {loading ? "Enregistrement..." : "Enregistrer la page"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
