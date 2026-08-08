"use server";

import { prisma } from "@/lib/prisma";
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
    
    // Generate a unique filename
    const filename = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    const filepath = path.join(uploadDir, filename);

    // Write file to public/uploads
    fs.writeFileSync(filepath, buffer);

    const imageUrl = `/uploads/${filename}`;

    await prisma.galleryImage.create({
      data: {
        imageUrl,
        caption,
        displayOrder,
      },
    });
  }

  revalidatePath("/admin/dashboard/gallery");
  revalidatePath("/");
}

export async function deleteGalleryImage(id: string) {
  const image = await prisma.galleryImage.findUnique({ where: { id } });
  
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

    await prisma.galleryImage.delete({
      where: { id },
    });
  }
  
  revalidatePath("/admin/dashboard/gallery");
  revalidatePath("/");
}

export async function moveImageUp(id: string) {
  const image = await prisma.galleryImage.findUnique({ where: { id } });
  if (!image) return;

  const previousImage = await prisma.galleryImage.findFirst({
    where: { displayOrder: { lt: image.displayOrder } },
    orderBy: { displayOrder: "desc" }
  });

  if (previousImage) {
    await prisma.$transaction([
      prisma.galleryImage.update({ where: { id: image.id }, data: { displayOrder: previousImage.displayOrder } }),
      prisma.galleryImage.update({ where: { id: previousImage.id }, data: { displayOrder: image.displayOrder } })
    ]);
  }
  
  revalidatePath("/admin/dashboard/gallery");
  revalidatePath("/");
}

export async function moveImageDown(id: string) {
  const image = await prisma.galleryImage.findUnique({ where: { id } });
  if (!image) return;

  const nextImage = await prisma.galleryImage.findFirst({
    where: { displayOrder: { gt: image.displayOrder } },
    orderBy: { displayOrder: "asc" }
  });

  if (nextImage) {
    await prisma.$transaction([
      prisma.galleryImage.update({ where: { id: image.id }, data: { displayOrder: nextImage.displayOrder } }),
      prisma.galleryImage.update({ where: { id: nextImage.id }, data: { displayOrder: image.displayOrder } })
    ]);
  }
  
  revalidatePath("/admin/dashboard/gallery");
  revalidatePath("/");
}

export async function replaceGalleryImage(id: string, formData: FormData) {
  const file = formData.get("imageFile") as File | null;
  if (!file || file.size === 0) return { success: false };

  const image = await prisma.galleryImage.findUnique({ where: { id } });
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
  
  const filename = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  const filepath = path.join(uploadDir, filename);

  fs.writeFileSync(filepath, buffer);
  const newImageUrl = `/uploads/${filename}`;

  await prisma.galleryImage.update({
    where: { id },
    data: { imageUrl: newImageUrl }
  });

  revalidatePath("/admin/dashboard/gallery");
  revalidatePath("/");
  return { success: true };
}
