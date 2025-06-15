import jwt from "jsonwebtoken";

export const validateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1]; // Quitar "Bearer "

  if (!token) return res.status(401).json({ mensaje: "Token no proporcionado" });

  try {
    const usuario = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = usuario; // guardar los datos del usuario en la request
    next();
  } catch (err) {
    return res.status(403).json({ mensaje: "Token inválido o expirado" });
  }
};
