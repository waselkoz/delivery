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
      await supabase.from('CompletedDelivery').insert([
        {
          firstName: delivery.firstName,
          lastName: delivery.lastName,
          phone: delivery.phone,
          destination: delivery.destination,
          createdAt: delivery.createdAt,
        },
      ]);
      await supabase.from('DeliveryRequest').delete().eq('id', id);
    } else if (status === "Cancelled") {
      await supabase.from('CancelledDelivery').insert([
        {
          firstName: delivery.firstName,
          lastName: delivery.lastName,
          phone: delivery.phone,
          destination: delivery.destination,
          createdAt: delivery.createdAt,
        },
      ]);
      await supabase.from('DeliveryRequest').delete().eq('id', id);
    }
  }
  
  revalidatePath("/admin/deliveries");
}

export async function deleteDeliveryRequest(id: string) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error("Unauthorized");

  await supabase.from('DeliveryRequest').delete().eq('id', id);
  
  revalidatePath("/admin/deliveries");
}
