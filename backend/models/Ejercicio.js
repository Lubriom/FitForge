import { prisma } from "../config/db.js";

export class EjercicioModel {
  static async findByName(name) {
    try {
      return await prisma.ejercicio.findFirst({ where: { nombre: name } });
    } catch (error) {
      console.error("Error al obtener el ejercicio:", error);
    }
  }

  static async getById(id) {
    try {
      return await prisma.ejercicio.findUnique({ where: { id: parseInt(id) } });
    } catch (error) {
      console.error("Error al obtener el ejercicio:", error);
    }
  }

  static async getAll() {
    try {
      return await prisma.ejercicio.findMany({ orderBy: { id: "asc" } });
    } catch (error) {
      console.error("Error al obtener los ejercicios:", error);
    }
  }

  static async create(data) {
    try {
      return await prisma.ejercicio.create({ data });
    } catch (error) {
      console.error("Error al crear el ejercicio:", error);
    }
  }

  static async update({ id, data }) {
    const { ...fieldsToUpdate } = data;

    const cleanData = Object.fromEntries(
      Object.entries(fieldsToUpdate).filter(([_, v]) => v !== undefined && v !== null)
    );

    if (Object.keys(cleanData).length === 0) {
      throw new Error("No se enviaron campos para actualizar");
    }


    try {
      return await prisma.ejercicio.update({
        where: { id: parseInt(id) },
        data: cleanData
      });
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
    }

  }

  static async delete({ id }) {
    try {
      return await prisma.ejercicio.delete({ where: { id: parseInt(id) } });
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
    }
  }
}
