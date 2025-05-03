import { UserModel } from "../models/User.js";
import { InformacionSaludModel } from "../models/InformacionSalud.js";
import jwt from "jsonwebtoken";
import { InfoPatologiaModel } from "../models/InfoPatologia.js";

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

  static async updateInfo(req, res) {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1]; // Quitar "Bearer "

    const dataUser = {
      fec_nac: new Date(req.body.fec_nac),
      genero: req.body.genero
    };

    const infoUser = {
      peso: parseFloat(req.body.peso),
      altura: parseFloat(req.body.altura / 100),
      discapacidad: req.body.discapacidad,
      imc: parseFloat((req.body.peso / (((req.body.altura / 100) * req.body.altura) / 100)).toFixed(2)),
      fechaRegistro: new Date().toISOString()
    };

    const patologiasUser = {
      patologias: req.body.patologiasSeleccionadas
    };


    try {
      if (dataUser) {
        await UserModel.update({ id: jwt.decode(token).id, data: dataUser });
      }
      await InformacionSaludModel.create({ usuarioId: jwt.decode(token).id, data: infoUser });
      if (patologiasUser) {
        patologiasUser.patologias.forEach(async (patologia) => {
          await InfoPatologiaModel.create({
            usuarioId: jwt.decode(token).id,
            data: patologia
          });
        });
      }
      return res.status(200).send("Perfil actualizado");
    } catch (error) {
      console.log(error);
      return res.status(500).send("Error al actualizar el usuario");
    }
  }
}
