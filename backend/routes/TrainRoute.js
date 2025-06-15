import { Router } from "express";
import { validateId } from "../middlewares/validateId.js";
import { validateToken } from "../middlewares/validateToken.js";
import { validatePlanUpdate } from "../middlewares/validatePlanUpdate.js";
import { EntrenamientoController } from "../controllers/EntrenamientoController.js";
import { validateRole } from "../middlewares/validateRoles.js";

export const trainRouter = Router();

trainRouter.get("/plan/:id", validateId, validateToken, EntrenamientoController.getPlanById);
trainRouter.get("/user/:id", validateId, validateToken, EntrenamientoController.getPlanesPorUsuario);
trainRouter.get("/user/:id/days", validateId , validateToken, EntrenamientoController.getDiasEntrenados);
trainRouter.get("/user/:id/finish/days", validateId, validateToken, EntrenamientoController.getDiasEntrenadosUltimos7)

trainRouter.post("/autocreate", validateToken, EntrenamientoController.createAutoPlan);
trainRouter.post("/create", validateToken, validateRole("admin", "entrenador"), EntrenamientoController.createPlan);

trainRouter.patch("/day/:id/finalizar", validateToken, validateId, EntrenamientoController.finalizarDia);
trainRouter.patch("/update/:id/user/:userId", validateToken, validateRole("admin", "entrenador"), validateId, validatePlanUpdate, EntrenamientoController.update);
trainRouter.patch("/user/:userId/:id/toggle", validateToken, validateRole("admin", "entrenador"), validateId, EntrenamientoController.togglePlan);

trainRouter.delete("/delete/:id", validateToken, validateId, EntrenamientoController.delete);