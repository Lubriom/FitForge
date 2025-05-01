import { prisma } from "../config/db.js";

export class UserModel {
  static async getAll() {
    try {
      return await prisma.usuario.findMany();
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

  static async update({ id }, { nombre, email, password }) {
    try {
      if (!nombre && !email && !password) {
        throw new Error("No se enviaron campos para actualizar");
      }

      const data = {};
      if (nombre !== undefined) data.nombre = nombre;
      if (email !== undefined) data.email = email;
      if (password !== undefined) data.password = password;

      const user = await prisma.usuario.update({
        where: { id: parseInt(id) },
        data
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
