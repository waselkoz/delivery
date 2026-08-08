"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateLandingPageConfig(formData: FormData) {
  const formTitle = formData.get("formTitle") as string;
  const formSubtitle = formData.get("formSubtitle") as string;
  const formButtonText = formData.get("formButtonText") as string;
  const primaryColor = formData.get("primaryColor") as string;
  const formBackgroundColor = formData.get("formBackgroundColor") as string;
  const formTextColor = formData.get("formTextColor") as string;

  const existingConfig = await prisma.landingPageConfig.findFirst();

  if (existingConfig) {
    await prisma.landingPageConfig.update({
      where: { id: existingConfig.id },
      data: {
        formTitle,
        formSubtitle,
        formButtonText,
        primaryColor,
        formBackgroundColor,
        formTextColor,
      },
    });
  } else {
    await prisma.landingPageConfig.create({
      data: {
        formTitle,
        formSubtitle,
        formButtonText,
        primaryColor,
        formBackgroundColor,
        formTextColor,
      },
    });
  }

  revalidatePath("/");
  revalidatePath("/admin/dashboard/settings");
}
