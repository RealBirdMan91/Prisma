import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
 const deleteUser = await prisma.user.delete({
  where: {
    email: "elsa@prisma.io",
  },
});
    console.log(deleteUser);
}

main()
  .catch((e) => {
    console.log(e.message)
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
