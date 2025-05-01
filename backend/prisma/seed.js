import { prisma } from "../config/db.js";

async function main() {
  await prisma.usuario.createMany({
    data: [
      { nombre: 'Juan', email: 'juan@email.com', password: '123321', role: 'admin'},
      { nombre: 'Ana', email: 'ana@email.com', password: '123321', role: 'user'},
      { nombre: 'Jose', email: 'jose@gmail.com', password: '123321'}
    ],
  });
}

main()
  .then(() => {
    console.log('Datos insertados correctamente');
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });