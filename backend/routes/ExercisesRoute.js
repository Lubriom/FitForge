import { Router } from "express";
import { validateId } from "../middlewares/validateId.js";
import { validateToken } from "../middlewares/validateToken.js";
import { EjerciciosController } from "../controllers/EjerciciosController.js";
import { validateExerciseCreate } from "../middlewares/validateExercise.js";
import { validateExerciseUpdate } from "../middlewares/validateExerciseUpdate.js";

export const exerciseRouter = Router();

exerciseRouter.get("/get", EjerciciosController.getAll);
exerciseRouter.get("/get/:id", validateId, EjerciciosController.getById);
exerciseRouter.post("/create", validateToken, validateExerciseCreate, EjerciciosController.create);
exerciseRouter.patch("/update/:id", validateId, validateToken, validateExerciseUpdate , EjerciciosController.update);
exerciseRouter.delete("/delete/:id", validateId, validateToken, EjerciciosController.delete);