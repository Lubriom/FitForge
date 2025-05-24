import { EjercicioModel } from "../models/Ejercicio.js";

export class EjerciciosController {

  static async getById(req, res) {
    try {
      const { id } = req.params;
      return res.json(await EjercicioModel.getById(id));
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al obtener el ejercicio" });
    }
  }

  static async getAll(req, res) {
    try {
      return res.json(await EjercicioModel.getAll());
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al obtener los ejercicios" });
    }
  }

  static async create(req, res) {
    try {
      const dataExercise = {
        nombre: req.body.nombre,
        tipo: req.body.tipo,
        categoria: req.body.categoria,
        descanso: parseInt(req.body.descanso),
        series: parseInt(req.body.series),
        repeticiones: parseInt(req.body.repeticiones),
        peso: parseFloat(req.body.peso)
      };

      const findExercise = await EjercicioModel.findByName(dataExercise.nombre);
      if (findExercise) return res.status(400).json({ error: "Este ejercicio ya existe" });

      return res.json(await EjercicioModel.create(dataExercise));
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al crear el ejercicio" });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;

      const dataExercise = {
        nombre: req.body.nombre,
        tipo: req.body.tipo,
        categoria: req.body.categoria,
        descanso: parseInt(req.body.descanso),
        series: parseInt(req.body.series),
        repeticiones: parseInt(req.body.repeticiones),
        peso: parseFloat(req.body.peso)
      };

      const updatedExercise = await EjercicioModel.update({ id, data: dataExercise });

      return res.json({ exercise: updatedExercise });
    } catch (error) {
      console.log(error);
      return res.status(500).send("Error al actualizar el usuario");
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      return res.json(await EjercicioModel.delete({ id }));
    } catch (error) {
      return res.status(500).send("Error al eliminar el usuario");
    }
  }
}
