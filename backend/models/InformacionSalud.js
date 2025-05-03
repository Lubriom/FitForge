import { prisma } from "../config/db.js";

export class InformacionSaludModel {
  static async getInfoByID({ usuarioId }) {
    try {
      return await prisma.informacionSalud.findFirst({
        where: { usuarioId: parseInt(usuarioId) },
        orderBy: { fechaRegistro: "desc" }
      });
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
