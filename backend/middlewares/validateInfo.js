import { z } from "zod";

const validarFechaNac = (fechaStr) => {
  const fecha = new Date(fechaStr);
  const hoy = new Date();
  const hace120Anios = new Date(hoy.getFullYear() - 120, hoy.getMonth(), hoy.getDate());

  return (
    !isNaN(fecha.getTime()) && // válida
    fecha <= hoy && // no futura
    fecha >= hace120Anios // no excesivamente antigua
  );
};

const infoSchema = z.object({
  fec_nac: z.string().refine(validarFechaNac, {
    message: "Introduce una fecha válida y realista"
  }),

  genero: z.enum(["Hombre", "Mujer", "Otro"], {
    errorMap: () => ({ message: "Selecciona un género válido." })
  }),

  peso: z
    .number({ invalid_type_error: "Peso debe ser un número" })
    .min(1, "Peso debe ser mayor que 0")
    .max(500, "Peso demasiado alto"),

  altura: z
    .number({ invalid_type_error: "Altura debe ser un número" })
    .min(30, "Altura demasiado baja")
    .max(300, "Altura demasiado alta"),

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

export const validateInfo = (req, res, next) => {
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
