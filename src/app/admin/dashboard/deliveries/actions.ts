"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateDeliveryStatus(id: string, status: string) {
  const delivery = await prisma.deliveryRequest.findUnique({ where: { id } });
  
  if (delivery) {
    if (status === "Completed") {
      await prisma.completedDelivery.create({
        data: {
          firstName: delivery.firstName,
          lastName: delivery.lastName,
          phone: delivery.phone,
          destination: delivery.destination,
          createdAt: delivery.createdAt,
        },
      });
      await prisma.deliveryRequest.delete({ where: { id } });
    } else if (status === "Cancelled") {
      await prisma.cancelledDelivery.create({
        data: {
          firstName: delivery.firstName,
          lastName: delivery.lastName,
          phone: delivery.phone,
          destination: delivery.destination,
          createdAt: delivery.createdAt,
        },
      });
      await prisma.deliveryRequest.delete({ where: { id } });
    }
  }
  
  revalidatePath("/admin/dashboard/deliveries");
}

export async function deleteDeliveryRequest(id: string) {
  await prisma.deliveryRequest.delete({
    where: { id },
  });
  
  revalidatePath("/admin/dashboard/deliveries");
}
