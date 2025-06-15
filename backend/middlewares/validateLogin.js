import { z } from "zod";

const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{7,}$/;

const loginSchema = z.object({
  correo: z.string().email({ message: "Email no válido" }),
  password: z.string().refine((val) => passwordRegex.test(val), {
    message: "La contraseña debe tener mínimo 7 caracteres, una letra, un número y un carácter especial"
  })
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
