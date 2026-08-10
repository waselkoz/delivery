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
          firstName: delivery.firstName,
          lastName: delivery.lastName,
          phone: delivery.phone,
          destination: delivery.destination,
          createdAt: delivery.createdAt,
        },
      ]);
      
      if (insertError) {
        console.error("Failed to insert completed delivery:", insertError);
        throw insertError;
      }
      
      await supabase.from('DeliveryRequest').delete().eq('id', id);
      
      // Lazy Garbage Collection: Delete records older than 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      await supabase.from('CompletedDelivery').delete().lt('completedAt', sevenDaysAgo.toISOString());
      
    } else if (status === "Cancelled") {
      const { error: insertError } = await supabase.from('CancelledDelivery').insert([
        {
          firstName: delivery.firstName,
          lastName: delivery.lastName,
          phone: delivery.phone,
          destination: delivery.destination,
          createdAt: delivery.createdAt,
        },
      ]);
      
      if (insertError) {
        console.error("Failed to insert cancelled delivery:", insertError);
        throw insertError;
      }
      
      await supabase.from('DeliveryRequest').delete().eq('id', id);
      
      // Lazy Garbage Collection: Delete records older than 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      await supabase.from('CancelledDelivery').delete().lt('cancelledAt', sevenDaysAgo.toISOString());
    }
  }
  
  revalidatePath("/admin/dashboard/deliveries");
}

export async function deleteDeliveryRequest(id: string) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error("Unauthorized");

  await supabase.from('DeliveryRequest').delete().eq('id', id);
  
  revalidatePath("/admin/dashboard/deliveries");
}
