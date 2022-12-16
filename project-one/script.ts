import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findFirst({
    where: {
      email: {
        contains: "prisma",
        mode: 'insensitive'
      },
    },
  });
  console.log(users);
}

main()
  .catch((e) => {
    console.log(e.message);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
