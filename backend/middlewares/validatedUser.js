import { z } from "zod";

const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{6,}$/;

const userCreateSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  email: z.string().email("Email no válido"),
  password: z.string().refine((val) => passwordRegex.test(val), {
    message: "La contraseña debe tener mínimo 6 caracteres, una letra, un número y un carácter especial"
  })
});

export function validateUserCreate(req, res, next) {
  try {
    userCreateSchema.parse(req.body);
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
