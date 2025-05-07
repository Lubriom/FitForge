import { prisma } from "../config/db.js";

export class PlanEntrenamientoModel {
  static async create({ data }) {
    try {
      const { nombre, descripcion, objetivo, fechaInicio, dias } = data;

      const planActualizado = await prisma.planEntrenamiento.update({
        where: { id: planId },
        data: {
          nombre,
          descripcion,
          objetivo,
          fechaInicio: new Date(fechaInicio),
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
    
      if (dias && dias.length > 0) {
        await prisma.ejerciciosDia.deleteMany({
          where: {
            diaEntrenamiento: {
              planId
            }
          }
        });
    
        await prisma.diaEntrenamiento.deleteMany({
          where: {
            planId
          }
        });
    
        // Creamos los nuevos días y ejercicios
        await prisma.diaEntrenamiento.createMany({
          data: dias.map(dia => ({
            planId,
            nombre: dia.nombre,
            diaNumero: dia.diaNumero,
            ejercicios: {
              create: dia.ejercicios.map(ej => ({
                ejercicio: { connect: { id: ej.ejercicioId } },
                series: ej.series,
                repeticiones: ej.repeticiones,
                peso: ej.peso
              }))
            }
          }))
        });
      }

      return planActualizado;
    } catch (error) {
      console.error("Error al crear el plan de entrenamiento:", error);
    }
  }

  static async getById({ planId }) {
    try {
      return await prisma.planEntrenamiento.findUnique({
        where: { id: planId },
        include: {
          dias: {
            include: {
              ejercicios: {
                include: {
                  ejercicio: true // trae info del ejercicio
                }
              }
            }
          }
        }
      });
    } catch (error) {
      console.log("Error al obtener el plan de entrenamiento:", error);
    }
  }

  static async getPlanUserById({usuarioId}) {
    return await prisma.planEntrenamiento.findMany({
      where:  {usuarioId: usuarioId},
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
    const { nombre, descripcion, objetivo, fechaInicio, dias } = data;
  
    // Borra los días antiguos (lo que también borra los EjerciciosDia por cascada si está bien definida la BD)
    await prisma.ejercicios.deleteMany({
      where: {
        diaEntrenamiento: {
          planId
        }
      }
    });
  
    await prisma.diaEntrenamiento.deleteMany({
      where: {
        planId
      }
    });
  
    return await prisma.planEntrenamiento.update({
      where: { id: planId },
      data: {
        nombre,
        descripcion,
        objetivo,
        fechaInicio: new Date(fechaInicio),
        dias: {
          create: dias.map(dia => ({
            nombre: dia.nombre,
            diaNumero: dia.diaNumero,
            ejercicios: {
              create: dia.ejercicios.map(ej => ({
                ejercicio: { connect: { id: ej.ejercicioId } },
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
  
}
