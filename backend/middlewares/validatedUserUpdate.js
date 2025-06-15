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

const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{7,}$/;

const userUpdateSchema = z.object({
  nombre: z.string().min(3, "El nombre es requerido").optional(),
  apellido: z.string().min(3, { message: "El primer apellido es requerido" }).optional(),
  sapellido: z.string().min(3, { message: "El segundo apellido es requerido" }).optional(),
  correo: z.string().email("Email no válido").optional(),
  password: z.string().refine((val) => passwordRegex.test(val), {
    message: "La contraseña debe tener mínimo 7 caracteres, una letra, un número y un carácter especial"
  }).optional(),
  respassword: z.string().refine((val) => passwordRegex.test(val), {
    message: "La contraseña debe tener mínimo 7 caracteres, una letra, un número y un carácter especial"
  }).optional(),
  fec_nac: z.string().refine(validarFechaNac, {
    message: "Introduce una fecha válida y realista (hasta 120 años atrás)."
  }).optional(),
  genero: z.enum(["Hombre", "Mujer", "Otro"], {
    errorMap: () => ({ message: "Selecciona un género válido." })
  }).optional(),
  role: z.enum(["admin", "entrenador", "user"], {
    errorMap: () => ({ message: "Selecciona un rol valido." })
  }).optional()

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
