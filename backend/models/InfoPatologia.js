import { prisma } from "../config/db.js";

export class InfoPatologiaModel {
  static async getById({ usuarioId }) {
    try {
      const infoPatologia = await prisma.infoPatologias.findMany({ where: { usuarioId: parseInt(usuarioId) } });
      return infoPatologia;
    } catch (error) {
      console.error("Error al obtener la patologia:", error);
    }
  }

  static async create({ usuarioId, data }) {
    try {
      const infoPatologia = await prisma.infoPatologias.create({ data: { usuarioId: usuarioId, patologia: data } });
      return infoPatologia;
    } catch (error) {
      console.error("Error al crear la patologia:", error);
    }
  }

  static async delete({ id }) {
    try {
      const infoPatologia = await prisma.infoPatologias.delete({ where: { id: parseInt(id) } });
      return infoPatologia;
    } catch (error) {
      console.error("Error al eliminar la patologia:", error);
    }
  }
}
