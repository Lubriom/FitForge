import { z } from "zod";

// Definiciones de opciones permitidas

const planSchema = z
  .object({
    nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    descripcion: z.string().optional(),
    nivel: z.enum(["basico", "intermedio", "avanzado", "personalizado"], {
      errorMap: () => ({ message: "Selecciona un nivel válido" })
    }),
    objetivo: z.enum(["hipertrofia", "fuerza", "personalizado"], {
      errorMap: () => ({ message: "Selecciona un objetivo válido" })
    }),
    fechaInicio: z.string().refine((val) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const input = new Date(val);
      return !isNaN(input.getTime()) && input >= today;
    }, {
      message: "La fecha de inicio debe ser actual o posterior"
    }),
    fechaFin: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "La fecha final no es válida"
    })
  })
  .refine((data) => {
    const inicio = new Date(data.fechaInicio);
    const fin = new Date(data.fechaFin);
    return !isNaN(inicio.getTime()) && !isNaN(fin.getTime()) && fin > inicio;
  }, {
    message: "La fecha final debe ser posterior a la de inicio",
    path: ["fechaFin"]
  });

export function validatePlanCreate(req, res, next) {
    try {
      planSchema.parse(req.body);
      next();
    } catch (error) {
      return res.status(400).json({
        errors: error.errors.map((err) => ({
          field: err.path[0],
          message: err.message
        }))
      });
    }
  }
