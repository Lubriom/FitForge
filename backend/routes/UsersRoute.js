import { Router } from "express";
import { UserController } from "../controllers/UsersController.js";
import { validateId } from "../middlewares/validateId.js";
import { validateUserCreate } from "../middlewares/validatedUser.js";
import { validateUserUpdate } from "../middlewares/validatedUserUpdate.js";

export const userRouter = Router();

userRouter.get("/", UserController.getAll);
userRouter.get("/:id", validateId, UserController.getById);
userRouter.delete("/:id", validateId ,UserController.delete);
userRouter.post("/", validateUserCreate, UserController.create);
userRouter.patch("/:id", validateId, validateUserUpdate, UserController.update);
