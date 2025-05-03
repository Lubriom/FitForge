import { prisma } from "../../config/db.js";
import bcrypt from "bcryptjs";
import { main as seederEjercicios } from "./ejerciciosSeed.js"
import { date } from "zod";

async function main() {
  await prisma.usuario.createMany({
    data: [
      {
        nombre: "Juan",
        apellido: "Perez",
        sapellido: "Perez",
        correo: "juan@email.com",
        password: await bcrypt.hash("123321", 10),
        role: "admin",
        genero: "Hombre",
        fec_nac: new Date(2004, 6, 15)
      },
      {
        nombre: "Ana",
        apellido: "Perez",
        sapellido: "Perez",
        correo: "ana@email.com",
        password: await bcrypt.hash("123321", 10),
        role: "admin",
        genero: "Mujer",
        fec_nac: new Date(2004, 6, 15)
      },
      {
        nombre: "Jose",
        apellido: "Perez",
        sapellido: "Perez",
        correo: "jose@gmail.com",
        password: await bcrypt.hash("123321", 10),
        role: "admin",
        genero: "Hombre",
        fec_nac: new Date(2004, 6, 15)
      },
      {
        nombre: "Roy Lee",
        apellido: "Lunar",
        sapellido: "More",
        correo: "lunarmorer@gmail.com",
        password: await bcrypt.hash("123321", 10),
        role: "admin",
        genero: "Hombre",
        fec_nac: new Date(2004, 6, 12)
      }
    ]
  });
  console.log("[DB]: Usuarios insertados");
}

main()
  .then(() => {
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
