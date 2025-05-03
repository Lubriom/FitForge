import { Router } from "express";
import { UserController } from "../controllers/UsersController.js";
import { validateId } from "../middlewares/validateId.js";
import { validateUserCreate } from "../middlewares/validatedUser.js";
import { validateUserUpdate } from "../middlewares/validatedUserUpdate.js";
import { validateInfo } from "../middlewares/validateInfo.js";
import { validateToken } from "../middlewares/validateToken.js";

export const userRouter = Router();

userRouter.get("/", UserController.getAll);
userRouter.post("/start", validateToken, validateInfo, UserController.updateInfo);
userRouter.get("/:id", validateToken, validateId, UserController.getById);
userRouter.delete("/:id", validateToken, validateId ,UserController.delete);
userRouter.post("/", validateToken, validateUserCreate, UserController.create);
userRouter.patch("/:id", validateToken, validateId, validateUserUpdate, UserController.update);
