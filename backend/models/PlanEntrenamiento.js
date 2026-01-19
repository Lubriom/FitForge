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
              elementos: {
                include: {
                  ejercicio: {
                    include: {
                      ejercicio: true
                    }
                  },
                  circuito: {
                    include: {
                      ejercicios: {
                        include: {
                          ejercicio: true
                        }
                      }
                    }
                  },
                  carrera: true,
                  nota: true,
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
            elementos: {
              include: {
                ejercicio: true,
                circuito: {
                  include: {
                    ejercicios: true
                  }
                },
                carrera: true,
                nota: true,
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
      // 🔹 1. Eliminar los elementos asociados a los días del plan
      await tx.elementoDia.deleteMany({
        where: {
          dia: { planId: planId }
        }
      });

      // 🔹 2. Eliminar días antiguos
      await tx.diaEntrenamiento.deleteMany({
        where: { planId: planId }
      });

      // 🔹 3. Actualizar el plan con sus nuevos días y elementos
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

              elementos: {
                create: dia.elementos.map((el) => {
                  const base = {
                    tipo: el.tipo,
                    orden: el.orden
                  };

                  // 🏋️ Ejercicio individual
                  if (el.tipo === "ejercicio") {
                    return {
                      ...base,
                      ejercicio: {
                        create: {
                          ejercicio: { connect: { id: el.ejercicio.ejercicioId } },
                          series: el.ejercicio.series,
                          repeticiones: el.ejercicio.repeticiones,
                          peso: el.ejercicio.peso,
                          descanso: el.ejercicio.descanso
                        }
                      }
                    };
                  }

                  // 🔁 Circuito con ejercicios
                  if (el.tipo === "circuito") {
                    return {
                      ...base,
                      circuito: {
                        create: {
                          rondas: el.circuito.rondas,
                          descansoEntre: el.circuito.descansoEntre,
                          tiempoEntre: el.circuito.tiempoEntre,
                          ejercicios: {
                            create: el.circuito.ejercicios.map((ej) => ({
                              ejercicio: { connect: { id: ej.ejercicioId } },
                              repeticiones: ej.repeticiones,
                              peso: ej.peso,
                              orden: ej.orden
                            }))
                          }
                        }
                      }
                    };
                  }

                  // 🏃 Carrera
                  if (el.tipo === "carrera") {
                    return {
                      ...base,
                      carrera: {
                        create: {
                          distancia: el.carrera.distancia,
                          duracion: el.carrera.duracion,
                          ritmo: el.carrera.ritmo
                        }
                      }
                    };
                  }

                  if (el.tipo === "nota") {
                    return {
                      ...base,
                      nota: {
                        create: {
                          nota: el.nota.nota
                        }
                      }
                    };
                  }

                  return base;
                })
              }
            }))
          }
        },
        include: {
          dias: {
            include: {
              elementos: {
                include: {
                  ejercicio: { include: { ejercicio: true } },
                  circuito: { include: { ejercicios: { include: { ejercicio: true } } } },
                  carrera: true,
                  nota: true,
                }
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

  static async togglePlan({ id, userId }) {
    const plan = await prisma.planEntrenamiento.findUnique({
      where: { id },
      select: { activo: true, usuarioId: true }
    });

    if (!plan) throw new Error("Plan no encontrado");

    await prisma.planEntrenamiento.updateMany({
      where: { usuarioId: userId },
      data: { activo: false }
    });

    const updatedPlan = await prisma.planEntrenamiento.update({
      where: { id },
      data: { activo: true }
    });

    return updatedPlan;
  }

  static async obtenerMetricasRecientes({ userId }) {
    return await prisma.informacionSalud.findMany({
      where: { usuarioId: userId },
      orderBy: { fechaRegistro: "desc" },
      take: 7
    });
  }

  static async getEstadisticas({ id }) {
    const userId = id;

    try {
      // 1. Obtener la cantidad de días finalizados
      const diasFinalizados = await prisma.diaEntrenamiento.count({
        where: {
          finalizado: true,
          plan: {
            usuarioId: userId
          }
        }
      });

      // 2. Grupo muscular más entrenado (entre los días finalizados)
      const grupoMasEntrenado = await prisma.diaEntrenamiento.groupBy({
        by: ["grupoMuscular"],
        where: {
          finalizado: true,
          plan: {
            usuarioId: userId
          },
          grupoMuscular: {
            not: null
          }
        },
        _count: {
          grupoMuscular: true
        },
        orderBy: {
          _count: {
            grupoMuscular: "desc"
          }
        },
        take: 1
      });

      // 3. Plan de entrenamiento más completado (por número de días finalizados)
      const rutinaMasCompletada = await prisma.planEntrenamiento.findFirst({
        where: {
          usuarioId: userId,
          dias: {
            some: {
              finalizado: true
            }
          }
        },
        orderBy: {
          dias: {
            _count: "desc"
          }
        },
        select: {
          nombre: true,
          _count: {
            select: {
              dias: {
                where: {
                  finalizado: true
                }
              }
            }
          }
        }
      });

      return {
        diasFinalizados,
        grupoMuscularMasEntrenado: grupoMasEntrenado[0]?.grupoMuscular || null,
        rutinaMasCompletada: rutinaMasCompletada?.nombre || null
      };
    } catch (error) {
      console.error("Error obteniendo estadísticas:", error);
      throw new Error("Error al obtener las estadísticas del usuario");
    }
  }
}
