import { prisma } from "../config/db.js";
import bcrypt from "bcryptjs";

export class UserModel {
  static async getAll() {
    try {
      return await prisma.usuario.findMany({
        orderBy: { id: "asc" }
      });
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
    }
  }

  static async getPaginated({ skip, limit, query, ordenarPor, direccion }) {
    try {
      return await prisma.usuario.findMany({
        skip,
        take: limit,
        where: {
          OR: [
            {
              nombre: {
                contains: query,
                mode: "insensitive"
              }
            },
            {
              apellido: {
                contains: query,
                mode: "insensitive"
              }
            },
            {
              sapellido: {
                contains: query,
                mode: "insensitive"
              }
            },
            {
              correo: {
                contains: query,
                mode: "insensitive"
              }
            },

            {
              id: isNaN(Number(query)) ? undefined : Number(query)
            }
          ]
        },
        orderBy: {
          [ordenarPor]: direccion
        }
      });
    } catch (error) {
      console.error("Error al listar los usuarios:", error);
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

  static async update({ id, data }) {
    const { ...fieldsToUpdate } = data;

    const cleanData = Object.fromEntries(
      Object.entries(fieldsToUpdate).filter(([_, v]) => v !== undefined && v !== null)
    );

    if (Object.keys(cleanData).length === 0) {
      throw new Error("No se enviaron campos para actualizar");
    }

    if (cleanData.password) {
      cleanData.password = await bcrypt.hash(cleanData.password, 10);
    }

    try {
      const user = await prisma.usuario.update({
        where: { id: parseInt(id) },
        data: cleanData
      });

      return user;
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
    }
  }

  static async delete({ id }) {
    try {
      return await prisma.usuario.delete({ where: { id: parseInt(id) } });
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
    }
  }

  static async countAll(query = "") {
    try {
      return await prisma.usuario.count({
        where: {
          OR: [
            {
              nombre: {
                contains: query,
                mode: "insensitive"
              }
            },
            {
              correo: {
                contains: query,
                mode: "insensitive"
              }
            },
            {
              id: isNaN(Number(query)) ? undefined : Number(query)
            }
          ]
        }
      });
    } catch (error) {
      console.error("Error al contar los usuarios:", error);
      return 0;
    }
  }
}
