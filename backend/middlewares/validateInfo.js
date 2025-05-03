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
    message: "Introduce una fecha válida y realista (hasta 120 años atrás)."
  }),

  genero: z.enum(["Masculino", "Femenino", "Otro"], {
    errorMap: () => ({ message: "Selecciona un género válido." })
  }),

  peso: z.string().refine((val) => /^\d{1,3}(\.\d{1,2})?$/.test(val), {
    message: "Peso debe ser un número válido (hasta 2 decimales)."
  }),

  altura: z.string().refine((val) => /^\d{2,3}(\.\d{1,2})?$/.test(val), {
    message: "Altura debe ser un número válido en centímetros (hasta 2 decimales)."
  }),

  discapacidad: z.enum(["no", "0-32", "33-64", "65-100"], {
    errorMap: () => ({ message: "Selecciona un grado de discapacidad válido." })
  }),

  patologiasSeleccionadas: z.array(z.string()).optional()
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
