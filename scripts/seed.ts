const { PrismaClient } = require("@prisma/client");

const database = new PrismaClient();

async function main() {
  try {
    await database.category.createMany({
      data: [
        { name: "Computer Science" },
        { name: "Medicine" },
        { name: "Mathematics" },
        { name: "Religion" },
        { name: "Language" },
        { name: "Photography" },
        { name: "Agriculture" },
        { name: "History" },
      ],
    });

    console.log("Success seeding the database categories");
  } catch (error) {
    console.log("Error seeding the database categories", error);
  } finally {
    await database.$disconnect();
  }
}

main();
