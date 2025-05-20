import { Router } from "express";
import { validateId } from "../middlewares/validateId.js";
import { validateToken } from "../middlewares/validateToken.js";
import { EntrenamientoController } from "../controllers/EntrenamientoController.js";
import { EjerciciosController } from "../controllers/EjerciciosController.js";

export const trainRouter = Router();

trainRouter.get("/user/:id", validateId, validateToken, EntrenamientoController.getPlanesPorUsuario);