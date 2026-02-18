import { prisma } from "./config/db";


async function main() {
  await prisma.user.createMany({
    data: [
      { username: "Mashrafil" },
      { username: "Hossain" },
      { username: "Mahi" },
     
    ],
    skipDuplicates: true
  });

  console.log("Users seeded successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
