import { z } from "zod";

// Definiciones de opciones permitidas

const ejercicioSchema = z.object({
  ejercicioId: z.number().refine((val) => /^\d+$/.test(val.toString()) && Number(val) >= 1, {
    message: "Por favor seleccione un ejercicio."
  }),
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

const ejercicioDiaSchema = z.object({
  tipo: z.literal("ejercicio"),
  orden: z.number().int().min(1, "El ejercicio debe tener un orden"),
  ejercicio: ejercicioSchema
});

const circuitoSchema = z.object({
  tipo: z.literal("circuito"),
  orden: z.number().int().min(1, "El circuito debe tener un orden"),
  circuito: z.object({
    rondas: z
      .string()
      .nonempty("El circuito debe tener al menos una ronda.")
      .refine((val) => /^\d+$/.test(val.toString()), {
        message: "El numero de rondas debe ser un número valido y positivo."
      }),
    descansoEntre: z
      .string()
      .nonempty("Debe haber descanso entre las rondas.")
      .refine((val) => /^\d+$/.test(val.toString()), {
        message: "El descanso entre las rondas debe ser un número valido y positivo."
      }),
    tiempoEntre: z
      .string()
      .nonempty("Hay que especificar la duración de las rondas.")
      .refine((val) => /^\d+$/.test(val.toString()), {
        message: "La duración de las rondas debe ser un número valido y positivo."
      }),
    ejercicios: z
      .array(
        z.object({
          ejercicioId: z.number().refine((val) => /^\d+$/.test(val.toString()) && Number(val) >= 1, {
            message: "Por favor seleccione un ejercicio para el circuito."
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
            }),
          orden: z.number().int().min(1, "El ejercicio del circuito debe tener un orden")
        })
      )
      .nonempty("El circuito debe tener al menos un ejercicio.")
  })
});

const carreraSchema = z.object({
  tipo: z.literal("carrera"),
  orden: z.number().int().min(1, "La carrera debe tener un orden"),
  carrera: z.object({
    distancia: z
      .string()
      .nonempty("Debes indicar la distancia de tu carrera")
      .refine((val) => /^\d+$/.test(val.toString()) && Number(val) >= 1, {
        message: "La distancia debe ser un número valido y positivo."
      })
      .optional(),
    duracion: z
      .string()
      .nonempty("Debes indicar la duración de tu carrera")
      .refine((val) => /^\d+$/.test(val.toString()) && Number(val) >= 1, {
        message: "La duración debe ser un número valido y positivo."
      })
      .optional(),
    ritmo: z
      .string()
      .refine((val) => /^\d+$/.test(val.toString()) && Number(val) >= 1, {
        message: "El ritmo debe ser un número valido y positivo."
      })
      .optional()
  })
});

const notaSchema = z.object({
  tipo: z.literal("nota"),
  orden: z.number().int().min(1, "La nota debe tener un orden"),
  nota: z.object({
    nota: z.string().nonempty("La nota es obligatoria")
  })
});

const elementosSchema = z.discriminatedUnion("tipo", [ejercicioDiaSchema, circuitoSchema, carreraSchema, notaSchema]);

const diaSchema = z.object({
  diaNumero: z.number().int().positive(),
  grupoMuscular: z.enum(["pecho", "brazos", "hombros", "full body", "espalda", "abdomen", "piernas"], {
    message: "Grupo muscular inválido"
  }),
  fecha: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Fecha inválida"
  }),
  elementos: z.array(elementosSchema).nonempty("Debe haber al menos un elemento en el día.")
});

const planUpdateSchema = z.object({
  nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  descripcion: z.string().max(500).optional(),
  nivel: z.enum(["basico", "intermedio", "avanzado", "personalizado"]),
  objetivo: z.enum(["hipertrofia", "fuerza", "personalizado"]),
  activo: z.boolean(),
  dias: z.array(diaSchema).min(1, "Debe haber al menos un día en el plan")
});

// Middleware para validar el update del planñ
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
