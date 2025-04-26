import { z } from "zod";

const userCreateSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  email: z.string().email("Email no válido"),
  password: z.string().min(6, "La contraseña debe tener mínimo 6 caracteres"),
});

export function validateUserCreate(req, res, next) {
  try {
    userCreateSchema.parse(req.body); 
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
