import { prisma } from "../../config/db.js";
import bcrypt from "bcryptjs";
import fs from "fs/promises";
import { main as seederEjercicios } from "./ejerciciosSeed.js";
import { date } from "zod";

async function main() {
  try {
    const data = await fs.readFile("./prisma/seeder/users.json", "utf-8");
    const usuarios = JSON.parse(data);

    for (const usuario of usuarios) {
      usuario.password = await bcrypt.hash(usuario.password.toString(), 10);
      usuario.fec_nac = new Date(usuario.fec_nac);
      await prisma.usuario.create({ data: usuario });
    }

    console.log("[DB]: Usuarios insertados");
  } catch (error) {
    console.error(error);
  }
}

main()
  .then(() => {})
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
