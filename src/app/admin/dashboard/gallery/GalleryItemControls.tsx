"use client";

import { useState, useRef } from "react";
import { ArrowUp, ArrowDown, Trash2, Upload } from "lucide-react";
import { moveImageUp, moveImageDown, deleteGalleryImage, replaceGalleryImage } from "./actions";
import toast from "react-hot-toast";

export default function GalleryItemControls({ 
  id, 
  isFirst, 
  isLast,
  onOptimisticUpdate
}: { 
  id: string, 
  isFirst: boolean, 
  isLast: boolean,
  onOptimisticUpdate?: (type: 'moveUp' | 'moveDown' | 'delete') => void
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isReplacing, setIsReplacing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleMoveUp() {
    onOptimisticUpdate?.('moveUp');
    await moveImageUp(id);
  }

  async function handleMoveDown() {
    onOptimisticUpdate?.('moveDown');
    await moveImageDown(id);
  }

  async function handleDelete() {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette image ?")) {
      setIsDeleting(true);
      onOptimisticUpdate?.('delete');
      await deleteGalleryImage(id);
    }
  }

  async function handleReplace(e: React.ChangeEvent<HTMLInputElement>) {
    let file = e.target.files?.[0];
    if (file) {
      setIsReplacing(true);
      
      try {
        const imageCompression = (await import('browser-image-compression')).default;
        const options = { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true };
        file = await imageCompression(file, options);
      } catch (error) {
        console.error("Image compression error:", error);
      }

      const formData = new FormData();
      formData.append("imageFile", file);
      
      const result = await replaceGalleryImage(id, formData);
      if (result && result.error) {
        setIsReplacing(false);
        toast.error(result.error);
        return;
      }
      setIsReplacing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={handleMoveUp}
        disabled={isFirst}
        className="p-3 bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-900 border border-gray-200 disabled:opacity-30 disabled:hover:bg-white transition-all shadow-sm rounded-none"
        title="Déplacer vers le haut"
      >
        <ArrowUp className="w-5 h-5" strokeWidth={1.5} />
      </button>

      <button
        onClick={handleMoveDown}
        disabled={isLast}
        className="p-3 bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-900 border border-gray-200 disabled:opacity-30 disabled:hover:bg-white transition-all shadow-sm rounded-none"
        title="Déplacer vers le bas"
      >
        <ArrowDown className="w-5 h-5" strokeWidth={2} />
      </button>

      <div className="w-px h-8 bg-gray-200 mx-3"></div>

      <input 
        type="file" 
        accept="image/*" 
        ref={fileInputRef} 
        onChange={handleReplace} 
        className="hidden" 
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={isReplacing}
        className="flex items-center px-4 py-3 bg-white text-slate-900 border border-gray-300 hover:bg-gray-50 transition-all disabled:opacity-30 rounded-none shadow-sm uppercase gap-2"
        title="Remplacer l'image"
      >
        <Upload className="w-4 h-4" strokeWidth={2} />
        <span className="text-xs font-bold tracking-widest">{isReplacing ? "Téléchargement..." : "Remplacer"}</span>
      </button>

      <div className="w-px h-8 bg-gray-200 mx-3"></div>

      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="p-3 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition-all disabled:opacity-30 shadow-sm rounded-none"
        title="Supprimer l'image"
      >
        <Trash2 className="w-5 h-5" strokeWidth={2} />
      </button>
    </div>
  );
}
