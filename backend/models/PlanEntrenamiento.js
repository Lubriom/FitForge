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

  static async update({ planId, userId, data }) {
    const { nombre, descripcion, nivel, activo, objetivo, fechaInicio, fechaFin, dias } = data;

    return await prisma.$transaction(async (tx) => {
      // Primero borrar ejercicios asociados a días del plan
      await tx.ejerciciosDia.deleteMany({
        where: {
          dia: {
            planId: planId
          }
        }
      });

      // Borrar días antiguos
      await tx.diaEntrenamiento.deleteMany({
        where: {
          planId: planId
        }
      });

      // Actualizar plan y crear días y ejercicios nuevos
      return await tx.planEntrenamiento.update({
        where: { id: planId },
        data: {
          nombre,
          descripcion,
          nivel,
          activo,
          objetivo,
          usuarioId: userId,
          fechaInicio: new Date(fechaInicio),
          fechaFin: new Date(fechaFin),
          dias: {
            create: dias.map((dia) => ({
              diaNumero: dia.diaNumero,
              grupoMuscular: dia.grupoMuscular,
              finalizado: dia.finalizado,
              fecha: new Date(dia.fecha),
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
    });
  }

  static async delete({ id }) {
    return await prisma.planEntrenamiento.delete({
      where: { id: id }
    });
  }

  static async finalizarDia({ id }) {
    return await prisma.diaEntrenamiento.update({
      where: { id: id },
      data: { finalizado: true }
    });
  }

  static async getDiasEntrenados({ id }) {
    return await prisma.diaEntrenamiento.findMany({
      where: {
        finalizado: true,
        plan: {
          usuarioId: id
        }
      }
    });
  }

  
}
