import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
 const updateUser = await prisma.user.update({
    where: {
      email: 'elsa@prisma.io',
    },
    data: {
      name: 'Elsa the Magnificent',
    },
  })
    console.log(updateUser);
}

main()
  .catch((e) => {
    console.log(e.message)
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
