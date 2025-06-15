import { z } from "zod";

const infoSchema = z.object({
  peso: z
    .number({ invalid_type_error: "Peso debe ser un número" })
    .min(1, "Peso debe ser mayor que 0")
    .max(500, "Peso demasiado alto"),

  altura: z
    .number({ invalid_type_error: "Altura debe ser un número" })
    .min(30, "Altura demasiado baja")
    .max(300, "Altura demasiado alta"),
    
  rm: z
    .number({ invalid_type_error: "RM debe ser un número" })
    .min(0, "RM debe ser mayor o igual que 0")
    .max(500, "RM demasiado alto"),

  discapacidad: z.enum(["no", "0-32", "33-64", "65-100"], {
    errorMap: () => ({ message: "Selecciona un grado de discapacidad válido." })
  }),

  patologiasSeleccionadas: z
    .array(
      z.enum([
        "Cardíacas",
        "Respiratorias",
        "Metabólicas",
        "Musculoesqueléticas",
        "Neurológicas",
        "Digestivas",
        "Psicológicas"
      ]),
      {
        errorMap: () => ({ message: "Selecciona al menos una patología válida." })
      }
    )
    .optional()
});

export const validateStats = (req, res, next) => {
  try {
    infoSchema.parse(req.body);
    next();
  } catch (error) {
    return res.status(400).json({
      errors: error.errors.map((err) => ({
        field: err.path[0],
        message: err.message
      }))
    });
  }
};
