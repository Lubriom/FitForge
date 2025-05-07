import { InfoPatologiaModel } from "../models/InfoPatologia.js";
import { InformacionSaludModel } from "../models/InformacionSalud.js";

export class InfoController {
  static async getLast(req, res) {
    try {
      const { id } = req.params;
      return res.json(await InformacionSaludModel.getById({usuarioId: id, type: 'last' }));
    } catch (error) {
        console.log(error)
      return res.status(500).send("Error al obtener la informacion del usuario");
    }
  }

  static async getAll(req, res) {
    try {
      const { id } = req.params;
      return res.json(await InformacionSaludModel.getById({ usuarioId: id, type: 'all' }));
    } catch (error) {
      return res.status(500).send("Error al obtener la informacion del usuarios");
    }
  }

  static async getPatologias(req, res) {
    try {
      const { id } = req.params;
      return res.json(await InfoPatologiaModel.getById({ usuarioId: id }));
    } catch (error) {
      return res.status(500).send("Error al obtener la informacion del usuarios");
    }
  }
}
