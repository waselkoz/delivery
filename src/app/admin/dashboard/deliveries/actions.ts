"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateDeliveryStatus(id: string, status: string) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error("Unauthorized");

  const { data: delivery } = await supabase
    .from('DeliveryRequest')
    .select('*')
    .eq('id', id)
    .single();
  
  if (delivery) {
    if (status === "Completed") {
      const { error: insertError } = await supabase.from('CompletedDelivery').insert([
        {
          id: delivery.id,
          firstName: delivery.firstName || "-",
          lastName: delivery.lastName || "-",
          phone: delivery.phone || "-",
          destination: delivery.destination || "-",
          landingPageId: delivery.landingPageId || null,
          customData: delivery.customData || null,
          createdAt: delivery.createdAt || new Date().toISOString(),
        },
      ]);
      
      if (insertError) {
        console.error("Failed to insert completed delivery:", insertError);
        throw new Error("DB_ERROR: " + insertError.message + " | Details: " + (insertError.details || "none"));
      }
      
      await supabase.from('DeliveryRequest').delete().eq('id', id);
      
      // Lazy Garbage Collection: Delete records older than 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      await supabase.from('CompletedDelivery').delete().lt('completedAt', sevenDaysAgo.toISOString());
      
    } else if (status === "Cancelled") {
      const { error: insertError } = await supabase.from('CancelledDelivery').insert([
        {
          id: delivery.id,
          firstName: delivery.firstName || "-",
          lastName: delivery.lastName || "-",
          phone: delivery.phone || "-",
          destination: delivery.destination || "-",
          landingPageId: delivery.landingPageId || null,
          customData: delivery.customData || null,
          createdAt: delivery.createdAt || new Date().toISOString(),
        },
      ]);
      
      if (insertError) {
        console.error("Failed to insert cancelled delivery:", insertError);
        throw new Error("DB_ERROR: " + insertError.message + " | Details: " + (insertError.details || "none"));
      }
      
      await supabase.from('DeliveryRequest').delete().eq('id', id);
      
      // Lazy Garbage Collection: Delete records older than 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      await supabase.from('CancelledDelivery').delete().lt('cancelledAt', sevenDaysAgo.toISOString());
    }
  }
  revalidatePath("/admin/dashboard/deliveries");
  revalidatePath("/admin/dashboard");
}

export async function deleteDeliveryRequest(id: string) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error("Unauthorized");

  await supabase.from('DeliveryRequest').delete().eq('id', id);
  revalidatePath("/admin/dashboard/deliveries");
  revalidatePath("/admin/dashboard");
}
