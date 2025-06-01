import { z } from "zod";

// Definiciones de opciones permitidas

const ejercicioSchema = z.object({
  descanso: z
    .string()
    .nonempty("El descanso es obligatorio")
    .refine((val) => /^\d+$/.test(val.toString()), {
      message: "El descanso debe ser un número válido y positivo."
    }),

  series: z
    .string()
    .nonempty("Las series son obligatorias")
    .refine((val) => /^\d+$/.test(val.toString()) && Number(val) >= 1, {
      message: "Debe haber al menos una serie."
    }),

  repeticiones: z
    .string()
    .nonempty("Las repeticiones son obligatorias")
    .refine((val) => /^\d+$/.test(val.toString()) && Number(val) >= 1, {
      message: "Debe haber al menos una repetición."
    }),

  peso: z
    .string()
    .nonempty("El peso es obligatorio")
    .refine((val) => /^\d{1,3}(\.\d{1,2})?$/.test(val.toString()), {
      message: "Peso debe ser un número válido (hasta 2 decimales)."
    })
});

const diaSchema = z.object({
  diaNumero: z.number().int().positive(),
  grupoMuscular: z.string().optional().nullable(),
  fecha: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Fecha inválida"
  }),
  ejercicios: z.array(ejercicioSchema)
});

const planUpdateSchema = z.object({
  nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  descripcion: z.string().max(500).optional(),
  nivel: z.enum(["basico", "avanzado", "personalizado"]),
  objetivo: z.enum(["hipertrofia", "fuerza", "personalizado"]),
  activo: z.boolean(),
  dias: z.array(diaSchema).min(1, "Debe haber al menos un día en el plan")
});

// Middleware para validar el update del plan
export function validatePlanUpdate(req, res, next) {
  try {
    planUpdateSchema.parse(req.body);
    next();
  } catch (error) {
    return res.status(400).json({
      errors: error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message
      }))
    });
  }
}
