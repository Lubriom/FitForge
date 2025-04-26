import { UserModel } from "../models/User.js";

export class UserController {
  static async getAll(req, res) {
    try {
      const users = await UserModel.getAll();
      return res.json(users);
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
      return res.status(500).send("Error al obtener los usuarios");
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;
      const user = await UserModel.getById({ id });
      return res.json(user);
    } catch (error) {
      console.error("Error al obtener el usuario:", error);
      return res.status(500).send("Error al obtener el usuario");
    }
  }

  static async create(req, res) {
    try {
        const user = await UserModel.create(req.body);
        return res.json(user);
    } catch (error) {
        console.error("Error al crear el usuario:", error);
        return res.status(500).send("Error al crear el usuario");
    }
  }

  static async update(req, res) {
    try {
        const { id } = req.params;
        const user = await UserModel.update({ id }, req.body);
        return res.json(user);
    } catch (error) {
        console.error("Error al actualizar el usuario:", error);
        return res.status(500).send("Error al actualizar el usuario");
    }
  }

  static async delete(req, res) {
    try {
        const { id } = req.params;
        const user = await UserModel.delete({ id });
        return res.json(user);
    } catch (error) {
        console.error("Error al eliminar el usuario:", error);
        return res.status(500).send("Error al eliminar el usuario");
    }
  }
}
