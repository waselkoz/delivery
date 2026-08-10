"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addGalleryImage(formData: FormData) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return { success: false, error: "Unauthorized" };

  const file = formData.get("imageFile") as File | null;

  if (file && file.size > 0) {
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    const filename = `${Date.now()}-${sanitizedName}`;

    const { error: uploadError } = await supabase.storage
      .from('gallery')
      .upload(filename, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error("Supabase Storage Error:", uploadError);
      return { success: false, error: `Failed to upload image: ${uploadError.message}` };
    }

    const { data: { publicUrl } } = supabase.storage.from('gallery').getPublicUrl(filename);
    const imageUrl = publicUrl;

    const { data: maxOrderData } = await supabase.from('GalleryImage').select('displayOrder').order('displayOrder', { ascending: false }).limit(1).maybeSingle();
    const displayOrder = maxOrderData ? (maxOrderData.displayOrder + 1) : 0;

    const now = new Date().toISOString();
    const { error } = await supabase.from('GalleryImage').insert([
      {
        id: crypto.randomUUID(),
        imageUrl,
        caption: null,
        displayOrder,
        createdAt: now,
        updatedAt: now,
      },
    ]);

    if (error) {
      console.error("Supabase DB Error:", error);
      return { success: false, error: `Failed to save image to database: ${error.message}` };
    }
  }

  revalidatePath("/admin/dashboard/gallery");
  revalidatePath("/");
  return { success: true };
}

export async function deleteGalleryImage(id: string) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error("Unauthorized");

  const { data: image } = await supabase.from('GalleryImage').select('*').eq('id', id).single();
  
  if (image) {
    try {
      const urlParts = image.imageUrl.split('/');
      const filename = urlParts[urlParts.length - 1];
      if (filename) {
        await supabase.storage.from('gallery').remove([filename]);
      }
    } catch (err) {
      console.error("Failed to delete file from storage", err);
    }

    await supabase.from('GalleryImage').delete().eq('id', id);
  }
  
  revalidatePath("/admin/dashboard/gallery");
  revalidatePath("/");
}

export async function moveImageUp(id: string) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error("Unauthorized");

  const { data: image } = await supabase.from('GalleryImage').select('*').eq('id', id).single();
  if (!image) return;

  const { data: previousImage } = await supabase.from('GalleryImage')
    .select('*')
    .lt('displayOrder', image.displayOrder)
    .order('displayOrder', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (previousImage) {
    await Promise.all([
      supabase.from('GalleryImage').update({ displayOrder: previousImage.displayOrder }).eq('id', image.id),
      supabase.from('GalleryImage').update({ displayOrder: image.displayOrder }).eq('id', previousImage.id)
    ]);
  }
  
  revalidatePath("/admin/dashboard/gallery");
  revalidatePath("/");
}

export async function moveImageDown(id: string) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error("Unauthorized");

  const { data: image } = await supabase.from('GalleryImage').select('*').eq('id', id).single();
  if (!image) return;

  const { data: nextImage } = await supabase.from('GalleryImage')
    .select('*')
    .gt('displayOrder', image.displayOrder)
    .order('displayOrder', { ascending: true })
    .limit(1)
    .maybeSingle();

  if (nextImage) {
    await Promise.all([
      supabase.from('GalleryImage').update({ displayOrder: nextImage.displayOrder }).eq('id', image.id),
      supabase.from('GalleryImage').update({ displayOrder: image.displayOrder }).eq('id', nextImage.id)
    ]);
  }
  
  revalidatePath("/admin/dashboard/gallery");
  revalidatePath("/");
}

export async function replaceGalleryImage(id: string, formData: FormData) {
  const file = formData.get("imageFile") as File | null;
  if (!file || file.size === 0) return { success: false };

  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error("Unauthorized");

  const { data: image } = await supabase.from('GalleryImage').select('*').eq('id', id).single();
  if (!image) return { success: false };

  try {
    const urlParts = image.imageUrl.split('/');
    const oldFilename = urlParts[urlParts.length - 1];
    if (oldFilename) {
      await supabase.storage.from('gallery').remove([oldFilename]);
    }
  } catch (err) {
    console.error("Failed to delete old file from storage during replace", err);
  }

  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
  const filename = `${Date.now()}-${sanitizedName}`;
  
  const { error: uploadError } = await supabase.storage
    .from('gallery')
    .upload(filename, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (uploadError) {
    console.error("Failed to upload new image during replace:", uploadError);
    return { success: false, error: uploadError.message };
  }

  const { data: { publicUrl } } = supabase.storage.from('gallery').getPublicUrl(filename);
  
  await supabase.from('GalleryImage').update({ imageUrl: publicUrl }).eq('id', id);

  revalidatePath("/admin/dashboard/gallery");
  revalidatePath("/");
  return { success: true };
}
