import { z } from "zod";

const loginSchema = z.object({
  correo: z.string().email({ message: "Email no válido" }),
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" })
});

export const validateLogin = (req, res, next) => {
  try {
    loginSchema.parse(req.body);
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
