import { z } from "zod";

const exerciseUpdateSchema = z
  .object({
    nombre: z.string().min(1, "El nombre es obligatorio").optional(),

    tipo: z
      .enum(["pull", "press", "squat", "lunges", "hit", "core"], {
        errorMap: () => ({ message: "Selecciona un tipo válido" }),
      })
      .optional(),

    categoria: z
      .enum(
        ["piernas", "pecho", "hombros", "espalda", "brazos", "abdomen", "full body"],
        {
          errorMap: () => ({ message: "Selecciona una categoría válida" }),
        }
      )
      .optional(),

    descanso: z
      .number({ required_error: "El descanso es obligatorio." })
      .min(0, { message: "El descanso no puede ser negativo." })
      .int({ message: "El descanso debe ser un número entero." })
      .optional(),

    series: z
      .number({ required_error: "El número de series es obligatorio." })
      .int({ message: "Las series deben ser un número entero." })
      .positive({ message: "Debe haber al menos una serie." })
      .optional(),

    repeticiones: z
      .number({ required_error: "El número de repeticiones es obligatorio." })
      .int({ message: "Las repeticiones deben ser un número entero." })
      .positive({ message: "Debe haber al menos una repetición." })
      .optional(),

    peso: z
      .number({ required_error: "El peso es obligatorio." })
      .min(0, { message: "El peso no puede ser negativo." })
      .optional(),
  })
  .partial();

export function validateExerciseUpdate(req, res, next) {
  try {
    exerciseUpdateSchema.parse(req.body);
    next();
  } catch (error) {
    return res.status(400).json({
      errors: error.errors.map((err) => ({
        field: err.path[0],
        message: err.message,
      })),
    });
  }
}
