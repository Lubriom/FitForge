import { z } from "zod";

const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{7,}$/;

const registerSchema = z.object({
  nombre: z.string().min(3, { message: "El nombre es requerido" }).nonempty("El nombre es obligatorio"),
  apellido: z
    .string()
    .min(3, { message: "El primer apellido es requerido" })
    .nonempty("El primer apellido es obligatorio"),
  sapellido: z
    .string()
    .min(3, { message: "El segundo apellido es requerido" })
    .nonempty("El segundo apellido es obligatorio"),
  correo: z.string().email({ message: "Email no válido" }).nonempty("El correo es obligatorio"),
  password: z.string().refine((val) => passwordRegex.test(val), {
    message: "La contraseña debe tener mínimo 7 caracteres, una letra, un número y un carácter especial"
  }),
  respassword: z.string().refine((val) => passwordRegex.test(val), {
    message: "La contraseña debe tener mínimo 7 caracteres, una letra, un número y un carácter especial"
  })
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
