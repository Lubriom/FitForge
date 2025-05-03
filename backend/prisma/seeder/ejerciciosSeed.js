import fs from "fs/promises";
import { prisma } from "../../config/db.js";

export async function main() {
  try {
    const data = await fs.readFile("./prisma/seeder/ejercicios.json", "utf-8");
    const ejercicios = JSON.parse(data);

    for (const ejercicio of ejercicios) {
      await prisma.ejercicio.create({ data: ejercicio });
    }

    console.log("[DB]: Ejercicios insertados");
  } catch (error) {
    console.error(error);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
