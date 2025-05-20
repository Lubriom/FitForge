import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const imgFolder = path.join(__dirname, "../public/uploads/pfp");

export class ImageController {
  static async getImage(req, res) {
    try {
      const filename = req.params.filename;
      const filepath = path.join(imgFolder, filename);

      if (!fs.existsSync(filepath)) {
        return res.status(404).send("Imagen no encontrada");
      }

      res.sendFile(filepath);
    } catch (error) {
      console.error("Error al actualizar la imagen:", error);
      return res.status(500).send("Error al subir la imagen");
    }
  }
}
