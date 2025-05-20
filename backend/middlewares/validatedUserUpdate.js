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

const userUpdateSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido").optional(),
  apellido: z.string().min(1, { message: "El primer apellido es requerido" }).optional(),
  sapellido: z.string().min(1, { message: "El segundo apellido es requerido" }).optional(),
  correo: z.string().email("Email no válido").optional(),
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" }).optional(),
  respassword: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" }).optional(),
  fec_nac: z.string().refine(validarFechaNac, {
    message: "Introduce una fecha válida y realista (hasta 120 años atrás)."
  }).optional(),
  genero: z.enum(["Hombre", "Mujer", "Otro"], {
    errorMap: () => ({ message: "Selecciona un género válido." })
  }).optional(),

}).partial();

export function validateUserUpdate(req, res, next) {
  try {
    userUpdateSchema.parse(req.body);
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
