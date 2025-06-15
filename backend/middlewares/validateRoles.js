export const validateRole = (...allowedRoles) => {
  return (req, res, next) => {
    const { usuario } = req;

    if (!usuario || !usuario.role) {
      return res.status(403).json({ mensaje: "Acceso denegado: sin rol definido." });
    }

    if (!allowedRoles.includes(usuario.role)) {
      return res.status(403).json({ mensaje: "Acceso denegado: rol no autorizado." });
    }

    next();
  };
};
