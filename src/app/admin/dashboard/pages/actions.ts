"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createLandingPage(formData: FormData) {
  const supabase = await createClient();
  
  const title = formData.get('title') as string;
  const subtitle = formData.get('subtitle') as string;
  const slug = formData.get('slug') as string;
  const buttonText = formData.get('buttonText') as string;
  const formConfigStr = formData.get('formConfig') as string;
  
  let formConfig = null;
  if (formConfigStr) {
    try { formConfig = JSON.parse(formConfigStr); } catch (e) {}
  }

  const { data, error } = await supabase.from('LandingPage').insert({
    title,
    subtitle,
    slug,
    buttonText,
    formConfig
  }).select().single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/admin/dashboard/pages');
  redirect(`/admin/dashboard/pages/${data.id}`);
}

export async function updateLandingPage(id: string, formData: FormData) {
  const supabase = await createClient();
  
  const title = formData.get('title') as string;
  const subtitle = formData.get('subtitle') as string;
  const slug = formData.get('slug') as string;
  const buttonText = formData.get('buttonText') as string;
  const formConfigStr = formData.get('formConfig') as string;
  
  let formConfig = null;
  if (formConfigStr) {
    try { formConfig = JSON.parse(formConfigStr); } catch (e) {}
  }

  const { error } = await supabase.from('LandingPage').update({
    title,
    subtitle,
    slug,
    buttonText,
    formConfig,
    updatedAt: new Date().toISOString()
  }).eq('id', id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/admin/dashboard/pages');
  revalidatePath(`/${slug}`);
  return { success: true };
}
