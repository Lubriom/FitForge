import { prisma } from "../config/db.js";

export class InformacionSaludModel {
  static async getById({ usuarioId, type }) {
    try {
      var info;
      switch (type) {
        case 'last':
          info = await prisma.informacionSalud.findFirst({
            where: { usuarioId: parseInt(usuarioId) },
            orderBy: { id: "desc" }
          });
          break;
        
        case 'first':
          info = await prisma.informacionSalud.findFirst({
            where: { usuarioId: parseInt(usuarioId) },
            orderBy: { id: "asc" }
          });
          break;

        default:
          info = await prisma.informacionSalud.findFirst({
            where: { usuarioId: parseInt(usuarioId) }
          });
          break;
      }
      return info;
    } catch (error) {
      console.error("Error al obtener la informacion del usuario:", error);
    }
  }

  static async create({ usuarioId, data }) {
    try {
      return await prisma.informacionSalud.create({ data: { ...data, usuarioId: usuarioId } });
    } catch (error) {
      console.error("Error al crear la información del usuario:", error);
    }
  }
}
