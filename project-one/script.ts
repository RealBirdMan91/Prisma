import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
   const createdUser = await prisma.user.create({data: {
       name: "manfred"
    }})

    console.log(createdUser);
}

main()
  .catch((e) => {
    console.log(e.message)
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
