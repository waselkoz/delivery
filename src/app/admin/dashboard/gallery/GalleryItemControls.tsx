"use client";

import { useState, useRef } from "react";
import { ArrowUp, ArrowDown, Trash2, Upload } from "lucide-react";
import { moveImageUp, moveImageDown, deleteGalleryImage, replaceGalleryImage } from "./actions";

export default function GalleryItemControls({ 
  id, 
  isFirst, 
  isLast 
}: { 
  id: string, 
  isFirst: boolean, 
  isLast: boolean 
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isMovingUp, setIsMovingUp] = useState(false);
  const [isMovingDown, setIsMovingDown] = useState(false);
  const [isReplacing, setIsReplacing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleMoveUp() {
    setIsMovingUp(true);
    await moveImageUp(id);
    setIsMovingUp(false);
  }

  async function handleMoveDown() {
    setIsMovingDown(true);
    await moveImageDown(id);
    setIsMovingDown(false);
  }

  async function handleDelete() {
    if (confirm("Are you sure you want to delete this photo?")) {
      setIsDeleting(true);
      await deleteGalleryImage(id);
      // Let it stay loading until unmounted
    }
  }

  async function handleReplace(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setIsReplacing(true);
      const formData = new FormData();
      formData.append("imageFile", file);
      await replaceGalleryImage(id, formData);
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
        disabled={isFirst || isMovingUp}
        className="p-3 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10  disabled:opacity-30 disabled:hover:bg-white/5 transition-all shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] hover:shadow-[0_4px_14px_0_rgba(255,255,255,0.05)] backdrop-blur-sm"
        title="Move Up"
      >
        <ArrowUp className="w-5 h-5" strokeWidth={1.5} />
      </button>

      <button
        onClick={handleMoveDown}
        disabled={isLast || isMovingDown}
        className="p-3 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10  disabled:opacity-30 disabled:hover:bg-white/5 transition-all shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] hover:shadow-[0_4px_14px_0_rgba(255,255,255,0.05)] backdrop-blur-sm"
        title="Move Down"
      >
        <ArrowDown className="w-5 h-5" strokeWidth={2} />
      </button>

      <div className="w-px h-8 bg-white/10 mx-3"></div>

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
        className="flex items-center px-4 py-3 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/30 hover:text-indigo-200 transition-all  disabled:opacity-30 backdrop-blur-sm"
        title="Replace Photo"
      >
        <Upload className="w-4 h-4 mr-2" strokeWidth={2} />
        <span className="text-sm font-medium tracking-wide">{isReplacing ? "Uploading..." : "Replace"}</span>
      </button>

      <div className="w-px h-8 bg-white/10 mx-3"></div>

      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="p-3 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 border border-red-500/20  transition-all disabled:opacity-30 backdrop-blur-sm"
        title="Delete Photo"
      >
        <Trash2 className="w-5 h-5" strokeWidth={2} />
      </button>
    </div>
  );
}
