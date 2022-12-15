import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const createdUser = await prisma.user.create({
    data: {
      email: 'marion@prisma.io',
      name: 'marion Prisma',
      profile: {
        create: {
          biography: 'Some nother biograpy data'
        }
      }
    },
    include: {
      profile: true
    }
  })

    console.log(createdUser);
}

main()
  .catch((e) => {
    console.log(e.message)
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
