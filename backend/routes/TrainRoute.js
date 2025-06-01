import { Router } from "express";
import { validateId } from "../middlewares/validateId.js";
import { validateToken } from "../middlewares/validateToken.js";
import { validatePlanUpdate } from "../middlewares/validatePlanUpdate.js";
import { EntrenamientoController } from "../controllers/EntrenamientoController.js";
import { EjerciciosController } from "../controllers/EjerciciosController.js";

export const trainRouter = Router();

trainRouter.get("/user/:id", validateId, EntrenamientoController.getPlanesPorUsuario);
trainRouter.get("/plan/:id", EntrenamientoController.getPlanById);
trainRouter.patch("/update/:id/user/:userId", validateToken, validateId, validatePlanUpdate, EntrenamientoController.update);
trainRouter.delete("/delete/:id", validateToken, validateId, EntrenamientoController.delete);
trainRouter.post("/create", validateToken, EntrenamientoController.createPlan);
trainRouter.post("/autocreate", validateToken, EntrenamientoController.createAutoPlan);