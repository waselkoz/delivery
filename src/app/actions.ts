"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function submitDeliveryRequest(formData: FormData) {
  const firstName = (formData.get("firstName") as string || "").trim().slice(0, 100);
  const lastName = (formData.get("lastName") as string || "").trim().slice(0, 100);
  const phone = (formData.get("phone") as string || "").trim().slice(0, 20);
  const destination = (formData.get("destination") as string || "").trim().slice(0, 500);

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
            createdAt: now,
            updatedAt: now,
          }
        ]);
        
      if (error) throw error;
      
      // Revalidate the admin page so they see it
      revalidatePath("/admin/dashboard/deliveries");
      return { success: true };
    } catch (error: unknown) {
      console.error("Failed to create delivery request:", error);
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  }
  
  return { success: false, error: "Missing required fields" };
}
