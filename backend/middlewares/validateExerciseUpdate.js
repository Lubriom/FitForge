import { z } from "zod";

const exerciseUpdateSchema = z.object({
  nombre: z.string().nonempty("El nombre es obligatorio").optional(),

  tipo: z
    .enum(["pull", "press", "squat", "lunges", "hit", "core"], {
      errorMap: () => ({ message: "Selecciona un tipo válido" })
    })
    .optional(),

  categoria: z
    .enum(["piernas", "pecho", "hombros", "espalda", "brazos", "abdomen", "full body"], {
      errorMap: () => ({ message: "Selecciona una categoría válida" })
    })
    .optional(),

  descanso: z
    .string()
    .nonempty("El descanso es obligatorio")
    .refine((val) => /^\d+$/.test(val), {
      message: "El descanso debe ser un número válido y positivo."
    })
    .optional(),

  series: z
    .string()
    .nonempty("Las series son obligatorias")
    .refine((val) => /^\d+$/.test(val) && Number(val) >= 1, {
      message: "Debe haber al menos una serie."
    })
    .optional(),

  repeticiones: z
    .string()
    .nonempty("Las repeticiones son obligatorias")
    .refine((val) => /^\d+$/.test(val) && Number(val) >= 1, {
      message: "Debe haber al menos una repetición."
    })
    .optional(),

  peso: z
    .string()
    .nonempty("El peso es obligatorio")
    .refine((val) => /^\d{1,3}(\.\d{1,2})?$/.test(val), {
      message: "Peso debe ser un número válido (hasta 2 decimales)."
    })
    .optional()
}).partial();

export function validateExerciseUpdate(req, res, next) {
  try {
    exerciseUpdateSchema.parse(req.body);
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
