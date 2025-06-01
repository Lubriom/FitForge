import { EjercicioModel } from "../models/Ejercicio.js";
import { PlanEntrenamientoModel } from "../models/PlanEntrenamiento.js";
import { UserModel } from "../models/User.js";
import { prisma } from "../config/db.js";

export class EntrenamientoController {
  static async createPlan(req, res) {
    try {
      const data = {
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        objetivo: req.body.objetivo,
        nivel: req.body.nivel,
        fechaInicio: new Date(req.body.fechaInicio),
        fechaFin: new Date(req.body.fechaFin),
        usuarioId: req.body.usuarioId
      };

      res.status(201).json(await PlanEntrenamientoModel.create({ data }));
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al crear el plan" });
    }
  }

  // Función auxiliar para obtener el próximo lunes (o el lunes actual si hoy ya es lunes)
  static getNextMonday(date = new Date()) {
    const day = date.getDay(); // 0 (domingo) a 6 (sábado)
    const diff = day === 0 ? 1 : day === 1 ? 0 : 8 - day;
    const monday = new Date(date);
    monday.setDate(date.getDate() + diff);
    monday.setHours(0, 0, 0, 0); // Resetear la hora
    return monday;
  }

  static async createAutoPlan(req, res) {
    try {
      const { usuarioId, objetivo, nivel, nombre, descripcion } = req.body;

      const usuario = await UserModel.getById({ id: usuarioId });
      if (!usuario) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      const genero = usuario.genero.toLowerCase();
      const rmUsuario = usuario.rm;
      const rm = nivel === "basico" ? (genero === "hombre" ? 50 : 30) : rmUsuario;

      const distribucionBase =
        genero === "femenino"
          ? ["piernas", "espalda", "piernas", "full body", "piernas", "espalda", null]
          : ["pecho", "piernas", "espalda", "pecho", "piernas", "espalda", null];

      const distribucionRotada = [];
      for (let semana = 0; semana < 4; semana++) {
        for (let i = 0; i < 7; i++) {
          distribucionRotada.push(distribucionBase[i]);
        }
      }

      const porcentajeCiclo =
        objetivo === "fuerza" ? [85, 85, 95, 85, 95, 95, 85, 95] : [60, 60, 80, 60, 80, 80, 60, 80];
      const repeticiones = objetivo === "fuerza" ? 3 : [12, 12, 8, 12, 8, 8, 12, 8];

      const ejercicios = await EjercicioModel.getAll();

      await prisma.planEntrenamiento.updateMany({
        where: { usuarioId: usuarioId, activo: true },
        data: { activo: false }
      });

      const fechaInicio = new Date();
      const fechaFin = new Date(fechaInicio);
      fechaFin.setDate(fechaFin.getDate() + 28);

      const nuevoPlan = await prisma.planEntrenamiento.create({
        data: {
          nombre: nombre || `Plan generado - ${fechaInicio.toISOString().slice(0, 10)}`,
          descripcion: descripcion || `Plan ${objetivo} nivel ${nivel}`,
          nivel,
          objetivo,
          fechaInicio,
          fechaFin,
          activo: true,
          usuario: { connect: { id: usuarioId } }
        }
      });

      let diaActual = new Date(fechaInicio);
      let diaEntrenamientoCount = 0;

      for (let i = 0; i < distribucionRotada.length; i++) {
        const grupoMuscular = distribucionRotada[i];

        if (!grupoMuscular) {
          await prisma.diaEntrenamiento.create({
            data: {
              diaNumero: diaEntrenamientoCount + 1,
              grupoMuscular: null,
              plan: { connect: { id: nuevoPlan.id } },
              finalizado: false,
              fecha: new Date(diaActual)
            }
          });

          diaEntrenamientoCount++;
          diaActual.setDate(diaActual.getDate() + 1);
          continue;
        }

        const ejerciciosFiltrados = ejercicios.filter((e) => e.categoria === grupoMuscular);
        const usados = new Set();
        const cantidadEjercicios = nivel === "basico" ? 5 : 8;
        const ejerciciosSeleccionados = [];

        while (ejerciciosSeleccionados.length < cantidadEjercicios) {
          const candidato = ejerciciosFiltrados[Math.floor(Math.random() * ejerciciosFiltrados.length)];
          if (candidato && !usados.has(candidato.id)) {
            usados.add(candidato.id);
            ejerciciosSeleccionados.push(candidato);
          }
        }

        const indicePorcentaje = diaEntrenamientoCount % porcentajeCiclo.length;
        const porcentaje = porcentajeCiclo[indicePorcentaje];
        const repeticion = Array.isArray(repeticiones) ? repeticiones[indicePorcentaje] : repeticiones;

        const diaEntrenamiento = await prisma.diaEntrenamiento.create({
          data: {
            diaNumero: diaEntrenamientoCount + 1,
            grupoMuscular,
            plan: { connect: { id: nuevoPlan.id } },
            finalizado: false,
            fecha: new Date(diaActual)
          }
        });

        for (const ejercicio of ejerciciosSeleccionados) {
          const nombreEjercicio = ejercicio.nombre.toLowerCase();

          if (nivel === "basico" && nombreEjercicio.includes("palmada")) {
            continue;
          }

          let peso =
            ejercicio.categoria === "brazos" || ejercicio.categoria === "hombros" ? rm * 0.3 : rm * (porcentaje / 100);

          let reps = repeticion;

          if (nombreEjercicio.includes("flexiones") && !nombreEjercicio.includes("palmada")) {
            peso = 0;
            reps = nivel === "basico" ? 10 : 15;
          }

          await prisma.ejerciciosDia.create({
            data: {
              dia: { connect: { id: diaEntrenamiento.id } },
              ejercicio: { connect: { id: ejercicio.id } },
              peso: Math.round(peso),
              repeticiones: reps,
              series: objetivo === "fuerza" ? (nivel === "basico" ? 5 : 6) : nivel === "basico" ? 3 : 5,
              descanso: objetivo === "fuerza" ? 300 : nivel === "basico" ? 90 : 120
            }
          });
        }

        diaEntrenamientoCount++;
        diaActual.setDate(diaActual.getDate() + 1);
      }

      res.status(201).json({
        message: "Plan de entrenamiento generado correctamente",
        planId: nuevoPlan.id
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al generar el plan de entrenamiento" });
    }
  }

  static async getPlanById(req, res) {
    const { id } = req.params;

    try {
      const plan = await PlanEntrenamientoModel.getById({ id: parseInt(id) });

      if (!plan) {
        return res.status(404).json({ error: "Plan no encontrado" });
      }

      res.status(200).json(plan);
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
    const { id: planId, userId } = req.params;
    const data = req.body;

    if (data.dias && Array.isArray(data.dias)) {
      data.dias = data.dias.map((dia) => ({
        ...dia,
        ejercicios: dia.ejercicios.map((ejercicio) => ({
          ...ejercicio,
          peso: parseFloat(ejercicio.peso) || 0,
          repeticiones: parseInt(ejercicio.repeticiones) || 0,
          series: parseInt(ejercicio.series) || 0,
          descanso: parseInt(ejercicio.descanso) || 0
        }))
      }));
    }

    try {
      const planActualizado = await PlanEntrenamientoModel.update({
        planId: parseInt(planId),
        userId: parseInt(userId),
        data: data
      });
      res.json({ message: "Plan actualizado con éxito", plan: planActualizado });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al actualizar el plan" });
    }
  }

  static async delete(req, res) {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({ error: "ID inválido o no proporcionado" });
    }

    try {
      await PlanEntrenamientoModel.delete({ id: parseInt(id) });
      res.json({ message: "Plan eliminado con éxito" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al eliminar el plan" });
    }
  }
}
