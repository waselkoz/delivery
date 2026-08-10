const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function clean() {
  await prisma.cancelledDelivery.deleteMany({});
  await prisma.completedDelivery.deleteMany({});
  await prisma.deliveryRequest.deleteMany({});
  console.log('All test delivery requests deleted.');
}

clean()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
