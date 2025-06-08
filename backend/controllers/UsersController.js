import { UserModel } from "../models/User.js";
import { InformacionSaludModel } from "../models/InformacionSalud.js";
import jwt from "jsonwebtoken";
import { InfoPatologiaModel } from "../models/InfoPatologia.js";
import fs from "fs";

const SECRET = process.env.JWT_SECRET ?? "miclave";

export class UserController {
  static async getAll(req, res) {
    try {
      return res.json(await UserModel.getAll());
    } catch (error) {
      return res.status(500).send("Error al obtener los usuarios");
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;
      return res.json(await UserModel.getById({ id }));
    } catch (error) {
      return res.status(500).send("Error al obtener el usuario");
    }
  }

  static async getPaginate(req, res) {
    try {
      const page = parseInt(req.query.page);
      const limit = parseInt(req.query.limit);
      const skip = ((isNaN(page) ? 1 : page) - 1) * (isNaN(limit) ? 10 : limit);

      const query = req.query.query || "";
      const ordenarPor = req.query.sortField || "id";
      const direccion = req.query.sortDirection === "desc" ? "desc" : "asc";

      const [users, total] = await Promise.all([
        UserModel.getPaginated({ skip, limit, query, ordenarPor, direccion }),
        UserModel.countAll(query)
      ]);

      const totalPages = Math.ceil(total / (isNaN(limit) ? 10 : limit));

      return res.json({
        users,
        page: isNaN(page) ? 1 : page,
        totalPages,
        total
      });
    } catch (error) {
      console.error("Error al obtener usuarios paginados:", error);
      return res.status(500).send("Error al obtener usuarios");
    }
  }

  static async create(req, res) {
    try {
      return res.json(await UserModel.create(req.body));
    } catch (error) {
      return res.status(500).send("Error al crear el usuario");
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;

      if (req.body.fec_nac) {
        req.body.fec_nac = new Date(req.body.fec_nac);
      }

      if (req.body.password && req.body.password !== req.body.respassword)
        return res.status(400).json({ error: "Las contraseñas no coinciden" });

      if (req.body.password) delete req.body.respassword;

      if (req.file) {
        const user = await UserModel.getById({ id });
        if (user?.profile_img && user?.profile_img !== "default.png") {
          const oldPath = `./public/uploads/pfp/${user.profile_img}`;
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }

        req.body.profile_img = req.file.filename;
      }

      // Actualizar usuario
      const updatedUser = await UserModel.update({ id, data: req.body });

      // Obtener ID del usuario desde el token
      const token = req.headers.authorization?.split(" ")[1];
      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
      } catch (err) {
        return res.status(401).json({ error: "Token inválido" });
      }

      // Si el usuario se está actualizando a sí mismo, generar nuevo token
      if (decoded.id.toString() === id.toString()) {
        const data = {
          id: updatedUser.id,
          nombre: updatedUser.nombre,
          correo: updatedUser.correo,
          role: updatedUser.role,
          profile_img: updatedUser.profile_img
        };

        const token = jwt.sign(data, SECRET, { expiresIn: "2h" });

        return res.json({ user: updatedUser, token: token });
      }

      return res.json({ user: updatedUser });
    } catch (error) {
      console.log(error);
      return res.status(500).send("Error al actualizar el usuario");
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      return res.json(await UserModel.update({ id, data: { activo: 0 } }));
    } catch (error) {
      return res.status(500).send("Error al eliminar el usuario");
    }
  }

  static async updateInfo(req, res) {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1]; // Quitar "Bearer "

    const dataUser = {
      fec_nac: new Date(req.body.fec_nac),
      genero: req.body.genero
    };

    const infoUser = {
      peso: parseFloat(req.body.peso),
      altura: parseFloat(req.body.altura / 100),
      discapacidad: req.body.discapacidad,
      imc: parseFloat((req.body.peso / (((req.body.altura / 100) * req.body.altura) / 100)).toFixed(2)),
      rm: parseFloat(req.body.rm ?? null),
      fechaRegistro: new Date().toISOString()
    };

    const patologiasUser = {
      patologias: req.body.patologiasSeleccionadas
    };

    try {
      if (dataUser) {
        await UserModel.update({ id: jwt.decode(token).id, data: dataUser });
      }
      await InformacionSaludModel.create({ usuarioId: jwt.decode(token).id, data: infoUser });
      if (patologiasUser) {
        const usuarioId = jwt.decode(token).id;
        const nuevasPatologias = patologiasUser.patologias;

        const patologiasExistentes = await InfoPatologiaModel.getById({ usuarioId });
        const nombresExistentes = patologiasExistentes.map((p) => p.nombre);

        for (const nombre of nuevasPatologias) {
          if (!nombresExistentes.includes(nombre)) {
            await InfoPatologiaModel.create({
              usuarioId,
              data: nombre
            });
          }
        }

        for (const existente of patologiasExistentes) {
          if (!nuevasPatologias.includes(existente.nombre)) {
            await InfoPatologiaModel.delete({ id: existente.id });
          }
        }
      }
      return res.status(200).send("Perfil actualizado");
    } catch (error) {
      console.log(error);
      return res.status(500).send("Error al actualizar el usuario");
    }
  }

  static async obtenerMetricas(req, res) {
    const userId = parseInt(req.params.id);

    try {
      const metricas = await UserModel.obtenerMetricasRecientes( { userId } );
      return res.json(metricas);
    } catch (error) {
      console.error("Error al obtener métricas:", error);
      return res.status(500).json({ error: "Error al obtener métricas del usuario" });
    }
  }

  static async getEstadisticas(req, res) {
    try {
      const estadisticas = await UserModel.getEstadisticas({ id: parseInt(req.params.id) });
      return res.json(estadisticas);
    } catch (error) {
      console.error("Error al obtener estadísticas:", error);
      return res.status(500).json({ error: "Error al obtener estadísticas del usuario" });
    }
  }
}
