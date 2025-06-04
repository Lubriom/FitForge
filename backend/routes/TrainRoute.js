import { Router } from "express";
import { validateId } from "../middlewares/validateId.js";
import { validateToken } from "../middlewares/validateToken.js";
import { validatePlanUpdate } from "../middlewares/validatePlanUpdate.js";
import { EntrenamientoController } from "../controllers/EntrenamientoController.js";

export const trainRouter = Router();

trainRouter.get("/plan/:id", EntrenamientoController.getPlanById);
trainRouter.get("/user/:id", validateId, EntrenamientoController.getPlanesPorUsuario);
trainRouter.get("/user/:id/days", validateId , validateToken, EntrenamientoController.getDiasEntrenados);
trainRouter.get("/user/:id/finish/days", validateId, validateToken, EntrenamientoController.getDiasEntrenadosUltimos7)
trainRouter.patch("/day/:id/finalizar", validateToken, validateId, EntrenamientoController.finalizarDia);
trainRouter.patch("/update/:id/user/:userId", validateToken, validateId, validatePlanUpdate, EntrenamientoController.update);
trainRouter.delete("/delete/:id", validateToken, validateId, EntrenamientoController.delete);
trainRouter.post("/create", validateToken, EntrenamientoController.createPlan);
trainRouter.post("/autocreate", validateToken, EntrenamientoController.createAutoPlan);