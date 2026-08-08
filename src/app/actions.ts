"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function submitDeliveryRequest(formData: FormData) {
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const phone = formData.get("phone") as string;
  const destination = formData.get("destination") as string;

  if (firstName && lastName && phone && destination) {
    try {
      await prisma.deliveryRequest.create({
        data: {
          firstName,
          lastName,
          phone,
          destination,
        },
      });
      
      // Revalidate the admin page so they see it
      revalidatePath("/admin/dashboard/deliveries");
      return { success: true };
    } catch (error: any) {
      console.error("Failed to create delivery request:", error);
      return { success: false, error: error.message };
    }
  }
  
  return { success: false, error: "Missing required fields" };
}
