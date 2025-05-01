import { UserModel } from "../models/User.js";

export class UserController {
  static async getAll(req, res) {
    try {
      return res.json(await UserModel.getAll());
    } catch (error) {
      return res.status(500).send("Error al obtener los usuarios");
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;
      return res.json(await UserModel.getById({ id }));
    } catch (error) {
      return res.status(500).send("Error al obtener el usuario");
    }
  }

  static async create(req, res) {
    try {
        return res.json(await UserModel.create(req.body));
    } catch (error) {
        return res.status(500).send("Error al crear el usuario");
    }
  }

  static async update(req, res) {
    try {
        const { id } = req.params;
        return res.json(await UserModel.update({ id }, req.body));
    } catch (error) {
        return res.status(500).send("Error al actualizar el usuario");
    }
  }

  static async delete(req, res) {
    try {
        const { id } = req.params;
        return res.json(await UserModel.delete({ id }));
    } catch (error) {
        return res.status(500).send("Error al eliminar el usuario");
    }
  }
}
