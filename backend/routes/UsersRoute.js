import { Router } from "express";
import { UserController } from "../controllers/UsersController.js";
import { validateId } from "../middlewares/validateId.js";
import { validateUserCreate } from "../middlewares/validatedUser.js";
import { validateUserUpdate } from "../middlewares/validatedUserUpdate.js";
import { validateInfo } from "../middlewares/validateInfo.js";
import { validateToken } from "../middlewares/validateToken.js";
import { InfoController } from "../controllers/InfoController.js";

export const userRouter = Router();

userRouter.get("/", UserController.getAll);
userRouter.get("/:id", validateToken, validateId, UserController.getById);
userRouter.get("/:id/info/all", validateToken, validateId, InfoController.getAll);
userRouter.get("/:id/info/last", validateToken, validateId, InfoController.getLast);
userRouter.get("/:id/patologias", validateToken, validateId, InfoController.getPatologias);
userRouter.post("/start", validateToken, validateInfo, UserController.updateInfo);
userRouter.delete("/:id", validateToken, validateId ,UserController.delete);
userRouter.post("/", validateToken, validateUserCreate, UserController.create);
userRouter.patch("/:id", validateToken, validateId, validateUserUpdate, UserController.update);
