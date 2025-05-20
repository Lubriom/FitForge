import { prisma } from "../config/db.js";

export class EjercicioModel {
  static async getAll() {
    try {
      return await prisma.ejercicio.findMany();
    } catch (error) {
      console.error("Error al obtener los ejercicios:", error);
    }
  }
}
