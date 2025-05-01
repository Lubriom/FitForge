import bcrypt from "bcryptjs";
import { UserModel } from "../models/User.js";
import { prisma } from "../config/db.js";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET ?? 'miclave';

export class AuthController {
  static async register(req, res) {
    console.log(req.body);
    const { nombre, email, password, respassword } = req.body;

    try {
      const existingUser = await prisma.usuario.findUnique({ where: { email } });
      if (existingUser) return res.status(400).json({ error: "Ya existe un usuario con este email" });
      if ( password !== respassword ) return res.status(400).json({ error: "Las contraseñas no coinciden" });

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.usuario.create({
        data: {
          nombre,
          email,
          password: hashedPassword,
          role: "user"
        }
      });

      const data = {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        role: user.role
      }

      const token = jwt.sign(data , SECRET, { expiresIn: "2h" });

      res.status(201).json({ message: "Usuario registrado correctamente", token});
    } catch (error) {
      res.status(500).json({ error: "Error interno" });
    }
  }

  static async login(req, res) {
    const { email, password } = req.body;

    try {
      const user = await prisma.usuario.findUnique({ where: { email } });
      if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

      const isPasswordValid = (bcrypt.compareSync(password, user.password));
      if (!isPasswordValid) return res.status(401).json({ error: "Contraseña incorrecta" });

      const data = {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        role: user.role
      }

      const token = jwt.sign(data , SECRET, { expiresIn: "2h" });

      res.json({ message: "Login exitoso", token });
    } catch (error) {
      res.status(500).json({ error: "Error interno" });
    }
  }
}
