"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateLandingPageConfig(formData: FormData) {
  const formTitle = formData.get("formTitle") as string;
  const formSubtitle = formData.get("formSubtitle") as string;
  const formButtonText = formData.get("formButtonText") as string;
  const primaryColor = formData.get("primaryColor") as string;
  const formBackgroundColor = formData.get("formBackgroundColor") as string;
  const formTextColor = formData.get("formTextColor") as string;

  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error("Unauthorized");

  const { data: existingConfig } = await supabase
    .from('LandingPageConfig')
    .select('id')
    .limit(1)
    .maybeSingle();

  if (existingConfig) {
    await supabase
      .from('LandingPageConfig')
      .update({
        formTitle,
        formSubtitle,
        formButtonText,
        primaryColor,
        formBackgroundColor,
        formTextColor,
      })
      .eq('id', existingConfig.id);
  } else {
    await supabase
      .from('LandingPageConfig')
      .insert([
        {
          formTitle,
          formSubtitle,
          formButtonText,
          primaryColor,
          formBackgroundColor,
          formTextColor,
        },
      ]);
  }

  revalidatePath("/");
  revalidatePath("/admin/dashboard/settings");
}
