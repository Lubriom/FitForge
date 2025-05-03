import { prisma } from "../config/db.js";

export class UserModel {
  static async getAll() {
    try {
      return await prisma.usuario.findMany({
         orderBy: { id: "asc" },
      });
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
    }
  }

  static async getById({ id }) {
    try {
      return await prisma.usuario.findUnique({ where: { id: parseInt(id) } });
    } catch (error) {
      console.error("Error al obtener el usuario:", error);
    }
  }

  static async create({ nombre, email, password }) {
    try {
      return await prisma.usuario.create({ data: { nombre, email, password } });
    } catch (error) {
      console.error("Error al crear el usuario:", error);
    }
  }

  static async update({id, data}) {
    const { ...fieldsToUpdate } = data;
  
    // Elimina las claves que estén undefined o null
    const cleanData = Object.fromEntries(
      Object.entries(fieldsToUpdate).filter(([_, v]) => v !== undefined && v !== null)
    );
  
    if (Object.keys(cleanData).length === 0) {
      throw new Error("No se enviaron campos para actualizar");
    }
  
    try {
      const user = await prisma.usuario.update({
        where: { id: parseInt(id) },
        data: cleanData
      });
  
      return user;
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
      throw error;
    }
  }
  

  static async delete({ id }) {
    try {
      return await prisma.usuario.delete({ where: { id: parseInt(id) } });
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
    }
  }
}
