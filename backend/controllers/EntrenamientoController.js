import { EjercicioModel } from "../models/Ejercicio.js";
import { PlanEntrenamientoModel } from "../models/PlanEntrenamiento.js";
import { UserModel } from "../models/User.js";
import { prisma } from "../config/db.js";
import { subDays, startOfDay, format, addDays, endOfDay } from "date-fns";

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


  static async finalizarDia(req, res) {
    try {
      const { id } = req.params;
      return res.json(await PlanEntrenamientoModel.finalizarDia({ id: parseInt(id) }));
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al finalizar el dia" });
    }
  }

  static async getDiasEntrenados(req, res) {
    try {
      const { id } = req.params;
      return res.json(await PlanEntrenamientoModel.getDiasEntrenados({ id: parseInt(id) }));
    } catch {
      console.error(error);
      res.status(500).json({ error: "Error al obtener los dias entrenados" });
    }
  }

  static async createAutoPlan(req, res) {
    try {
      const { usuarioId, objetivo, rm, nivel, nombre, descripcion } = req.body;

      const usuario = await UserModel.getById({ id: usuarioId });
      if (!usuario) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }
      const infoUsuario = await prisma.informacionSalud.findFirst({
        where: { usuarioId },
        orderBy: { fechaRegistro: "desc" }
      });

      const genero = usuario.genero.toLowerCase();

      // Si se proporciona un nuevo RM, actualiza el último registro de InformaciónSalud
      let rmUsuario = infoUsuario ? infoUsuario.rm : null;
      if (rm) {
        rmUsuario = rm;

        // Actualiza el último registro de InformaciónSalud
        const ultimaInfoSalud = await prisma.informacionSalud.findFirst({
          where: { usuarioId },
          orderBy: { fechaRegistro: "desc" }
        });

        if (ultimaInfoSalud) {
          await prisma.informacionSalud.update({
            where: { id: ultimaInfoSalud.id },
            data: { rm: parseFloat(rmUsuario) }
          });
        }
      }

      const rmFinal = nivel === "basico" ? (genero === "hombre" ? 50 : 30) : rmUsuario;

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

        const cantidadEjercicios = nivel === "basico" ? 5 : 8;

        // Mezcla aleatoriamente los ejercicios disponibles
        const ejerciciosBarajados = ejerciciosFiltrados.sort(() => Math.random() - 0.5);

        // Toma solo los ejercicios disponibles (aunque sean menos)
        const ejerciciosSeleccionados = ejerciciosBarajados.slice(0, cantidadEjercicios);

        if (ejerciciosSeleccionados.length < cantidadEjercicios) {
          console.warn(
            `[WARN] Solo se seleccionaron ${ejerciciosSeleccionados.length}/${cantidadEjercicios} ejercicios para ${grupoMuscular}.`
          );
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
            ejercicio.categoria === "brazos" || ejercicio.categoria === "hombros"
              ? rmFinal * 0.3
              : rmFinal * (porcentaje / 100);

          let reps = repeticion;

          if (nombreEjercicio.includes("flexiones") && nombreEjercicio.includes("palmada") && nombreEjercicio.includes("mountain") && nombreEjercicio.includes("abdominal") && nombreEjercicio.includes("sentadillas con salto")) {
            peso = 0;
            reps = nivel === "basico" ? 10 : 15;
          }

          if (nombreEjercicio.includes("sentadillas") && nombreEjercicio.includes("zancadas") && !nombreEjercicio.includes("planchas")) {
            peso = rmFinal * 0.3;
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
    const { id } = req.params;

    try {
      const planes = await PlanEntrenamientoModel.getPlanUserById({ usuarioId: parseInt(id) });
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

  static async getDiasEntrenadosUltimos7(req, res) {
    try {
      const userId = parseInt(req.params.id);
      const hoy = startOfDay(new Date());
      const fechaInicio = subDays(hoy, 6); // hace 7 días exactos
      const fechaFin = endOfDay(hoy); // ayer, para excluir hoy

      // Consultar días entrenados en el rango para planes del usuario
      const diasEntrenados = await prisma.diaEntrenamiento.findMany({
        where: {
          plan: {
            usuarioId: userId
          },
          finalizado: true,
          fecha: {
            gte: fechaInicio,
            lte: fechaFin
          }
        },
        select: { fecha: true },
        orderBy: { fecha: "asc" }
      });

      // Crear array con últimos 7 días (sin hoy)
      const dias = Array.from({ length: 7 }, (_, i) => {
        return format(addDays(fechaInicio, i), "yyyy-MM-dd");
      });

      const fechasEntrenadas = new Set(diasEntrenados.map((d) => format(d.fecha, "yyyy-MM-dd")));

      // Crear resultado con entrenado o no para cada día
      const resultado = dias.map((fechaStr) => ({
        fecha: fechaStr,
        entrenado: fechasEntrenadas.has(fechaStr)
      }));

      return res.json(resultado);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error al obtener días entrenados" });
    }
  }

  static async togglePlan(req, res) {
    try {
      const { id, userId } = req.params;
      const plan = await PlanEntrenamientoModel.togglePlan({ id: parseInt(id), userId: parseInt(userId) });
      return res.json(plan);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Error al activar el plan" });
    }
  }
}
