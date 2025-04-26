import { z } from "zod";

const userUpdateSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido").optional(),
  email: z.string().email("Email no válido").optional(),
  password: z.string().min(6, "La contraseña debe tener mínimo 6 caracteres").optional(),
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
