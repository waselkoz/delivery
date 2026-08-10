"use client";

import { useEffect, useState } from "react";
import { updateLandingPage } from "../actions";
import { createClient } from "@/lib/supabase/client";
import { ArrowRight, Save, Link as LinkIcon, Type, AlignLeft, ExternalLink } from "lucide-react";
import Link from "next/link";
import { use } from "react";
import toast from "react-hot-toast";
import FormBuilder from "../FormBuilder";

export default function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase.from('LandingPage').select('*').eq('id', id).single();
      setInitialData(data);
    }
    load();
  }, [id]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    
    try {
      const result = await updateLandingPage(id, formData);
      if (result?.error) {
        setError(result.error);
        setLoading(false);
      } else {
        toast.success("Enregistré avec succès");
        setLoading(false);
      }
    } catch (err) {
      setError("Une erreur inattendue est survenue");
      setLoading(false);
    }
  }

  if (!initialData) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8" dir="ltr">
        <div className="flex items-center gap-4">
          <Link href="/admin/dashboard/pages" className="text-slate-400 hover:text-slate-900 transition-colors p-2 rounded-full hover:bg-gray-100">
            <ArrowRight size={24} className="transform rotate-180" />
          </Link>
          <h1 className="text-3xl font-light tracking-wide text-slate-900">Modifier les paramètres de la page</h1>
        </div>
        <a 
          href={`/${initialData.slug}`} 
          target="_blank" 
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors"
        >
          Voir la page <ExternalLink size={16} />
        </a>
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
                defaultValue={initialData.slug}
                className="flex-1 bg-white border border-gray-300 px-4 py-2.5 rounded-r-md focus:outline-none focus:ring-2 focus:ring-slate-900 font-mono text-sm text-left"
                dir="ltr"
              />
            </div>
            <p className="text-xs text-slate-500">Doit être en minuscules anglaises sans espaces</p>
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
              defaultValue={initialData.title}
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
              defaultValue={initialData.subtitle}
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
              defaultValue={initialData.buttonText}
              className="w-full bg-white border border-gray-300 px-4 py-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <FormBuilder initialConfig={initialData.formConfig} />

          <div className="pt-6 border-t border-gray-100 flex justify-start" dir="ltr">
            <button 
              type="submit"
              disabled={loading}
              className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-md font-medium transition-colors flex items-center gap-2 disabled:opacity-50 flex-row"
            >
              <Save size={18} />
              {loading ? "Enregistrement..." : "Enregistrer les modifications"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
