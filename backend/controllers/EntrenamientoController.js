import { PlanEntrenamientoModel } from "../models/PlanEntrenamiento.js";

export class EntrenamientoController {
  static async createPlan(req, res) {
    try {
      res.status(201).json(await PlanEntrenamientoModel.create(req.body));
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al crear el plan" });
    }
  }

  static async getPlanById(req, res) {
    const { id } = req.params;

    try {
      const plan = await PlanEntrenamientoModel.getById(parseInt(id));

      if (!plan) {
        return res.status(404).json({ error: "Plan no encontrado" });
      }

      res.json(plan);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al obtener el plan" });
    }
  }

  static async getPlanesPorUsuario(req, res) {
    const { usuarioId } = req.params;

    try {
      const planes = await PlanEntrenamientoModel.getPlanUserById(parseInt(usuarioId));
      res.json(planes);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al obtener los planes del usuario" });
    }
  }

  static async update(req, res) {
    const { id } = req.params;

    try {
      const planActualizado = await PlanEntrenamientoModel.update(parseInt(id), req.body);
      res.json({ message: "Plan actualizado con éxito", plan: planActualizado });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al actualizar el plan" });
    }
  }
}
