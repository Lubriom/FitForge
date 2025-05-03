import { z } from "zod";

const registerSchema = z.object({
  nombre: z.string().min(1, { message: "El nombre es requerido" }),
  apellido: z.string().min(1, { message: "El primer apellido es requerido" }),
  sapellido: z.string().min(1, { message: "El segundo apellido es requerido" }),
  correo: z.string().email({ message: "Correo electronico no válido" }),
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
  respassword: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" })
});

export const validateRegister = (req, res, next) => {
  try {
    registerSchema.parse(req.body);
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
