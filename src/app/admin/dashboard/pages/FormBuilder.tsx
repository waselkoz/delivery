"use client";

import { useState } from "react";
import { Plus, Trash2, Settings, List, AlignLeft, Type } from "lucide-react";

export type CustomField = {
  id: string;
  type: "text" | "textarea" | "select";
  label: string;
  options: string[]; // array of strings for select options
  required: boolean;
};

export type FormConfig = {
  phonePlaceholder: string;
  namePlaceholder: string;
  destinationPlaceholder: string;
  customFields: CustomField[];
};

const DEFAULT_CONFIG: FormConfig = {
  phonePlaceholder: "Phone Number",
  namePlaceholder: "Full Name",
  destinationPlaceholder: "Delivery Address",
  customFields: [],
};

export default function FormBuilder({ initialConfig }: { initialConfig?: FormConfig }) {
  const [config, setConfig] = useState<FormConfig>(initialConfig || DEFAULT_CONFIG);

  const addCustomField = () => {
    setConfig({
      ...config,
      customFields: [
        ...config.customFields,
        {
          id: `field_${Date.now()}`,
          type: "text",
          label: "New Field",
          options: [],
          required: false,
        },
      ],
    });
  };

  const removeCustomField = (id: string) => {
    setConfig({
      ...config,
      customFields: config.customFields.filter((f) => f.id !== id),
    });
  };

  const updateCustomField = (id: string, updates: Partial<CustomField>) => {
    setConfig({
      ...config,
      customFields: config.customFields.map((f) => (f.id === id ? { ...f, ...updates } : f)),
    });
  };

  return (
    <div className="space-y-8 border-t border-gray-100 pt-8 mt-8">
      <input type="hidden" name="formConfig" value={JSON.stringify(config)} />
      
      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2" dir="rtl">
          <Settings size={20} className="text-slate-500" />
          تخصيص الحقول الافتراضية
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" dir="rtl">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">نص عنصر نائب للهاتف</label>
            <input 
              type="text" 
              value={config.phonePlaceholder}
              onChange={(e) => setConfig({ ...config, phonePlaceholder: e.target.value })}
              className="w-full bg-slate-50 border border-gray-200 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">نص عنصر نائب للاسم</label>
            <input 
              type="text" 
              value={config.namePlaceholder}
              onChange={(e) => setConfig({ ...config, namePlaceholder: e.target.value })}
              className="w-full bg-slate-50 border border-gray-200 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm"
            />
          </div>
        </div>
      </div>

      <div dir="rtl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <List size={20} className="text-slate-500" />
            حقول مخصصة
          </h3>
          <button 
            type="button" 
            onClick={addCustomField}
            className="text-sm font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded flex items-center gap-1 transition-colors"
          >
            <Plus size={16} /> إضافة حقل
          </button>
        </div>

        {config.customFields.length === 0 ? (
          <div className="text-center py-8 bg-slate-50 border border-gray-200 border-dashed rounded-md">
            <p className="text-slate-500 text-sm">لم يتم إضافة أي حقول مخصصة بعد.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {config.customFields.map((field, index) => (
              <div key={field.id} className="bg-white border border-gray-200 shadow-sm p-4 rounded-md relative flex flex-col md:flex-row gap-4 items-start md:items-center">
                <div className="absolute -left-3 -top-3 bg-slate-900 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-sm">
                  {index + 1}
                </div>
                
                <div className="flex-1 space-y-1 w-full">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">تسمية الحقل</label>
                  <input 
                    type="text" 
                    value={field.label}
                    onChange={(e) => updateCustomField(field.id, { label: e.target.value })}
                    className="w-full bg-slate-50 border border-gray-200 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm"
                  />
                </div>
                
                <div className="w-full md:w-48 space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">النوع</label>
                  <select 
                    value={field.type}
                    onChange={(e) => updateCustomField(field.id, { type: e.target.value as any })}
                    className="w-full bg-slate-50 border border-gray-200 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm"
                  >
                    <option value="text">إدخال نص</option>
                    <option value="textarea">وصف (مربع نص)</option>
                    <option value="select">قائمة منسدلة</option>
                  </select>
                </div>

                {field.type === "select" && (
                  <div className="w-full space-y-2 mt-4 border-t border-gray-100 pt-4">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">خيارات القائمة المنسدلة</label>
                    <div className="space-y-2 max-w-sm">
                      {Array.isArray(field.options) && field.options.map((opt, optIndex) => (
                        <div key={optIndex} className="flex items-center gap-2">
                          <input 
                            type="text" 
                            placeholder={`خيار ${optIndex + 1}`}
                            value={opt}
                            onChange={(e) => {
                              const newOptions = [...field.options];
                              newOptions[optIndex] = e.target.value;
                              updateCustomField(field.id, { options: newOptions });
                            }}
                            className="flex-1 bg-slate-50 border border-gray-200 px-3 py-1.5 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm"
                          />
                          <button 
                            type="button" 
                            onClick={() => {
                              const newOptions = field.options.filter((_, i) => i !== optIndex);
                              updateCustomField(field.id, { options: newOptions });
                            }}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                      <button 
                        type="button" 
                        onClick={() => {
                          const currentOptions = Array.isArray(field.options) ? field.options : (field.options ? (field.options as unknown as string).split(',').map(s => s.trim()) : []);
                          updateCustomField(field.id, { options: [...currentOptions, ""] });
                        }}
                        className="text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-md flex items-center gap-1 transition-colors"
                      >
                        <Plus size={14} /> إضافة خيار
                      </button>
                    </div>
                  </div>
                )}

                <div className="w-full md:w-32 flex items-center gap-2 md:mt-6">
                  <input 
                    type="checkbox" 
                    id={`req_${field.id}`}
                    checked={field.required}
                    onChange={(e) => updateCustomField(field.id, { required: e.target.checked })}
                    className="rounded text-slate-900 focus:ring-slate-900"
                  />
                  <label htmlFor={`req_${field.id}`} className="text-sm font-medium text-slate-700 cursor-pointer pr-2">مطلوب</label>
                </div>

                <div className="md:mt-6">
                  <button 
                    type="button" 
                    onClick={() => removeCustomField(field.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                    title="Remove Field"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
