import { InfoPatologiaModel } from "../models/InfoPatologia.js";
import { InformacionSaludModel } from "../models/InformacionSalud.js";
import { PlanEntrenamientoModel } from "../models/PlanEntrenamiento.js";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/User.js";

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

  static async getMetricas(req, res) {
    const userId = parseInt(req.params.id);

    try {
      const metricas = await PlanEntrenamientoModel.obtenerMetricasRecientes( { userId } );
      return res.json(metricas);
    } catch (error) {
      console.error("Error al obtener métricas:", error);
      return res.status(500).json({ error: "Error al obtener métricas del usuario" });
    }
  }

  static async getEstadisticas(req, res) {
    try {
      const estadisticas = await PlanEntrenamientoModel.getEstadisticas({ id: parseInt(req.params.id) });
      return res.json(estadisticas);
    } catch (error) {
      console.error("Error al obtener estadísticas:", error);
      return res.status(500).json({ error: "Error al obtener estadísticas del usuario" });
    }
  }
  
  static async updateInfo(req, res) {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1]; // Quitar "Bearer "

    const dataUser = {
      fec_nac: new Date(req.body.fec_nac ?? null ),
      genero: req.body.genero
    };

    const infoUser = {
      peso: parseFloat(req.body.peso),
      altura: parseFloat(req.body.altura / 100),
      discapacidad: req.body.discapacidad,
      imc: parseFloat((req.body.peso / (((req.body.altura / 100) * req.body.altura) / 100)).toFixed(2)),
      rm: parseFloat(req.body.rm ?? null),
      fechaRegistro: new Date().toISOString()
    };

    const patologiasUser = {
      patologias: req.body.patologiasSeleccionadas
    };

    try {
      if (dataUser.fec_nac || dataUser.genero) {
        await UserModel.update({ id: jwt.decode(token).id, data: dataUser });
      }
      await InformacionSaludModel.create({ usuarioId: jwt.decode(token).id, data: infoUser });
      if (patologiasUser) {
        const usuarioId = jwt.decode(token).id;
        const nuevasPatologias = patologiasUser.patologias;

        const patologiasExistentes = await InfoPatologiaModel.getById({ usuarioId });
        const nombresExistentes = patologiasExistentes.map((p) => p.nombre);

        for (const nombre of nuevasPatologias) {
          if (!nombresExistentes.includes(nombre)) {
            await InfoPatologiaModel.create({
              usuarioId,
              data: nombre
            });
          }
        }

        for (const existente of patologiasExistentes) {
          if (!nuevasPatologias.includes(existente.nombre)) {
            await InfoPatologiaModel.delete({ id: existente.id });
          }
        }
      }
      return res.status(200).send("Perfil actualizado");
    } catch (error) {
      console.log(error);
      return res.status(500).send("Error al actualizar el usuario");
    }
  }
}
