import { prisma } from "../config/db.js";

export class InfoPatologiaModel {
  static async findById({usuarioId}) {
    try {
      const infoPatologia = await prisma.infoPatologias.findMany({ where: { id: parseInt(usuarioId) } });
      return infoPatologia;
    } catch (error) {
        console.error("Error al obtener el usuario:", error);

    }
  }

  static async create({usuarioId, data}) {
    try {
      console.log(data)
      const infoPatologia = await prisma.infoPatologias.create({ data: {usuarioId: usuarioId, patologia: data  } });
      return infoPatologia;
    } catch (error) {
        console.error("Error al crear la patologia:", error);
    }
  }
}
