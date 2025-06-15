import multer from "multer";
import path from "path";

// Ruta donde se guardarán las imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve("public/uploads/pfp")); // Asegúrate que exista esta carpeta
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `pfp-${uniqueSuffix}${ext}`);
  },
});

// Filtro para aceptar solo ciertos tipos de imagen
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error("Formato de imagen no permitido"), false);
  }
  cb(null, true);
};

// Configuración final
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
});

export const uploadImage = upload.single("profile_img"); // el nombre del input del form debe ser 'imagen'
