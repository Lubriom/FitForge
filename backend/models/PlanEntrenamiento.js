import { prisma } from "../config/db.js";

export class PlanEntrenamientoModel {
  static async create({ data }) {
    try {
      const nuevoPlan = await prisma.planEntrenamiento.create({
        data: data
      });

      return nuevoPlan;
    } catch (error) {
      console.error("Error al crear plan de entrenamiento:", error);
      throw error;
    }
  }

  static async getById({ id }) {
    try {
      return await prisma.planEntrenamiento.findUnique({
        where: { id },
        include: {
          dias: {
            include: {
              ejercicios: {
                include: {
                  ejercicio: true
                }
              }
            }
          }
        }
      });
    } catch (error) {
      console.log("Error al obtener el plan de entrenamiento:", error);
      return null;
    }
  }

  static async getPlanUserById({ usuarioId }) {
    return await prisma.planEntrenamiento.findMany({
      where: { usuarioId: usuarioId },
      include: {
        dias: {
          include: {
            ejercicios: {
              include: {
                ejercicio: true
              }
            }
          }
        }
      },
      orderBy: { fechaInicio: "desc" }
    });
  }

  static async update(planId, data) {
    const { nombre, descripcion, nivel, activo, objetivo, usuarioId, fechaInicio, fechaFin, dias } = data;

    // Primero borramos los ejercicios antiguos asociados a los días del plan
    await prisma.ejerciciosDia.deleteMany({
      where: {
        dia: {
          planId
        }
      }
    });

    // Luego borramos los días antiguos del plan
    await prisma.diaEntrenamiento.deleteMany({
      where: {
        planId
      }
    });

    // Finalmente actualizamos el plan y creamos los días y ejercicios nuevos
    return await prisma.planEntrenamiento.update({
      where: { id: planId },
      data: {
        nombre,
        descripcion,
        nivel,
        activo,
        objetivo,
        usuarioId,
        fechaInicio: new Date(fechaInicio),
        fechaFin: new Date(fechaFin),
        dias: {
          create: dias.map((dia) => ({
            nombre: dia.nombre, // si tienes este campo en DiaEntrenamiento (en el modelo que enviaste no está, podrías eliminarlo)
            diaNumero: dia.diaNumero,
            grupoMuscular: dia.grupoMuscular,
            ejercicios: {
              create: dia.ejercicios.map((ej) => ({
                ejercicio: { connect: { id: ej.ejercicioId } },
                descanso: ej.descanso,
                series: ej.series,
                repeticiones: ej.repeticiones,
                peso: ej.peso
              }))
            }
          }))
        }
      },
      include: {
        dias: {
          include: {
            ejercicios: {
              include: { ejercicio: true }
            }
          }
        }
      }
    });
  }

  static async delete({ id }) {
    return await prisma.planEntrenamiento.delete({
      where: { id: id }
    });
  }
}
