import { EjercicioModel } from "../models/Ejercicio.js";

export class EjerciciosController {
  static async getAll(req, res) {
    try {
      return res.json(await EjercicioModel.getAll());
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al obtener los ejercicios" });
    }
  }
}
