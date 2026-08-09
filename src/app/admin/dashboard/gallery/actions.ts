"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import fs from "fs";
import path from "path";

export async function addGalleryImage(formData: FormData) {
  const file = formData.get("imageFile") as File | null;
  const caption = formData.get("caption") as string | null;
  const displayOrder = parseInt(formData.get("displayOrder") as string) || 0;

  if (file && file.size > 0) {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    
    // Generate a unique, url-safe filename
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    const filename = `${Date.now()}-${sanitizedName}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    
    // Ensure the uploads directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filepath = path.join(uploadDir, filename);

    // Write file to public/uploads
    fs.writeFileSync(filepath, buffer);

    const imageUrl = `/uploads/${encodeURIComponent(filename)}`;

    const supabase = await createClient();
    const now = new Date().toISOString();
    const { error } = await supabase.from('GalleryImage').insert([
      {
        id: crypto.randomUUID(),
        imageUrl,
        caption,
        displayOrder,
        createdAt: now,
        updatedAt: now,
      },
    ]);

    if (error) {
      console.error("Supabase Error:", error);
      throw new Error(`Failed to save image to database: ${error.message}`);
    }
  }

  revalidatePath("/admin/dashboard/gallery");
  revalidatePath("/");
}

export async function deleteGalleryImage(id: string) {
  const supabase = await createClient();
  const { data: image } = await supabase.from('GalleryImage').select('*').eq('id', id).single();
  
  if (image) {
    // Attempt to delete the file if it's local
    if (image.imageUrl.startsWith("/uploads/")) {
      const filepath = path.join(process.cwd(), "public", image.imageUrl);
      try {
        if (fs.existsSync(filepath)) {
          fs.unlinkSync(filepath);
        }
      } catch (err) {
        console.error("Failed to delete local file", err);
      }
    }

    await supabase.from('GalleryImage').delete().eq('id', id);
  }
  
  revalidatePath("/admin/dashboard/gallery");
  revalidatePath("/");
}

export async function moveImageUp(id: string) {
  const supabase = await createClient();
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
  const { data: image } = await supabase.from('GalleryImage').select('*').eq('id', id).single();
  if (!image) return { success: false };

  // Delete old file if it exists locally
  if (image.imageUrl.startsWith("/uploads/")) {
    const oldFilepath = path.join(process.cwd(), "public", image.imageUrl);
    try {
      if (fs.existsSync(oldFilepath)) {
        fs.unlinkSync(oldFilepath);
      }
    } catch (err) {
      console.error("Failed to delete local file during replace", err);
    }
  }

  // Save new file
  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);
  
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
  const filename = `${Date.now()}-${sanitizedName}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const filepath = path.join(uploadDir, filename);

  fs.writeFileSync(filepath, buffer);
  const newImageUrl = `/uploads/${encodeURIComponent(filename)}`;

  await supabase.from('GalleryImage').update({ imageUrl: newImageUrl }).eq('id', id);

  revalidatePath("/admin/dashboard/gallery");
  revalidatePath("/");
  return { success: true };
}
