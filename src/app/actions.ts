"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function submitDeliveryRequest(formData: FormData) {
  const fullName = (formData.get("fullName") as string || "").trim().slice(0, 100);
  const nameParts = fullName.split(" ");
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "-";
  const phone = (formData.get("phone") as string || "").trim().slice(0, 20);
  const destination = (formData.get("destination") as string || "").trim().slice(0, 500);
  const landingPageId = formData.get("landingPageId") as string | null;

  const customData: Record<string, string> = {};
  formData.forEach((value, key) => {
    if (key.startsWith("field_")) {
      customData[key.replace("field_", "")] = value.toString();
    }
  });

  const cookieStore = await cookies();
  const lastSubmit = cookieStore.get("last_delivery_submit")?.value;
  
  const honeypot = formData.get("company_website");
  if (honeypot) {
    // Bot detected: Silently pretend it succeeded
    return { success: true };
  }
  
  if (lastSubmit) {
    const timeSinceLastSubmit = Date.now() - parseInt(lastSubmit);
    if (timeSinceLastSubmit < 30000) {
      return { success: false, error: "Rate limit exceeded. Please wait 30 seconds before submitting another request." };
    }
  }

  if (firstName && lastName && phone && destination) {
    try {
      const supabase = await createClient();
      const now = new Date().toISOString();
      const { error } = await supabase
        .from('DeliveryRequest')
        .insert([
          {
            id: crypto.randomUUID(),
            firstName,
            lastName,
            phone,
            destination,
            landingPageId,
            customData,
            createdAt: now,
            updatedAt: now,
          }
        ]);
        
      if (error) throw error;
      
      cookieStore.set("last_delivery_submit", Date.now().toString(), { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === "production",
        maxAge: 30 // 30 seconds
      });
      
      revalidatePath("/admin/dashboard/deliveries");
      revalidatePath("/admin/dashboard");
      return { success: true };
    } catch (error: unknown) {
      console.error("Failed to create delivery request:", error);
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  }
  
  return { success: false, error: "Missing required fields" };
}
