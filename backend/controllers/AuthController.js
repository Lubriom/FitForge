import bcrypt from "bcryptjs";
import { UserModel } from "../models/User.js";
import { prisma } from "../config/db.js";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET ?? "miclave";

export class AuthController {

  static async register(req, res) {
    const { nombre, apellido, sapellido, correo, password, respassword } = req.body;

    try {
      const existingUser = await prisma.usuario.findUnique({ where: { correo } });
      if (existingUser && existingUser.activo)
        return res.status(400).json({ error: "Ya existe un usuario con este email" });
      if (password !== respassword) return res.status(400).json({ error: "Las contraseñas no coinciden" });

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await ((async) => {
        if (existingUser && !existingUser.activo)
          return prisma.usuario.update({
            where: { correo },
            data: { nombre, apellido, sapellido, correo, password: hashedPassword, activo: 1 }
          });

        return prisma.usuario.create({ data: { nombre, apellido, sapellido, correo, password: hashedPassword } });
      })();

      const data = {
        id: user.id,
        nombre: user.nombre,
        profile_img: user.profile_img,
        role: user.role
      };

      const token = jwt.sign(data, SECRET, { expiresIn: "2h" });

      res.status(201).json({ message: "Usuario registrado correctamente", token });
    } catch (error) {
      res.status(500).json({ error: "Error interno" });
      console.log(error);
    } 
  }

  static async login(req, res) {
    const { correo, password } = req.body;

    try {
      const user = await prisma.usuario.findUnique({ where: { correo } });
      if (!user) return res.status(404).json({ error: "Credenciales invalidas" });
      if (!user.activo) return res.status(404).json({ error: "Credenciales invalidas" });

      const isPasswordValid = bcrypt.compareSync(password, user.password);
      if (!isPasswordValid) return res.status(401).json({ error: "Contraseña incorrecta" });

      const data = {
        id: user.id,
        nombre: user.nombre,
        profile_img: user.profile_img,
        role: user.role
      };

      const token = jwt.sign(data, SECRET, { expiresIn: "2h" });

      res.json({ message: "Login exitoso", token });
    } catch (error) {
      res.status(500).json({ error: "Error interno" });
      console.log(error);
    }
  }

  static async refreshToken(req, res) {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1]; // Quitar "Bearer "

    if (!token) return res.status(401).json({ mensaje: "Token no proporcionado" });

    try {
      // Verificas que el token sea válido (no expirado y firmado con la clave)
      const decodedToken = jwt.verify(token, SECRET);

      // Extraes solo la info necesaria para el nuevo token
      const data = {
        id: decodedToken.id,
        nombre: decodedToken.nombre,
        correo: decodedToken.correo,
        profile_img: decodedToken.profile_img,
        role: decodedToken.role
      };

      // Creas un nuevo token con nueva expiración (2h)
      const nuevoToken = jwt.sign(data, SECRET, { expiresIn: "2h" });

      res.json({ message: "Token renovado", token: nuevoToken });
    } catch (error) {
      res.status(403).json({ mensaje: "Token inválido o expirado" });
    }
  }
}
