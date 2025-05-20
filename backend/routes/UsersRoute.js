import { Router } from "express";
import { UserController } from "../controllers/UsersController.js";
import { validateId } from "../middlewares/validateId.js";
import { validateUserCreate } from "../middlewares/validatedUser.js";
import { validateUserUpdate } from "../middlewares/validatedUserUpdate.js";
import { validateInfo } from "../middlewares/validateInfo.js";
import { validateToken } from "../middlewares/validateToken.js";
import { InfoController } from "../controllers/InfoController.js";
import { uploadImage } from "../middlewares/validateImage.js";

export const userRouter = Router();

userRouter.get("/get", UserController.getAll);
userRouter.get("/paginate", validateToken, UserController.getPaginate);
userRouter.get("/get/:id", validateToken, validateId, UserController.getById);
userRouter.get("/get/:id/info/all", validateToken, validateId, InfoController.getAll);
userRouter.get("/get/:id/info/last", validateToken, validateId, InfoController.getLast);
userRouter.get("/get/:id/patologias", validateToken, validateId, InfoController.getPatologias);
userRouter.post("/start", validateToken, validateInfo, UserController.updateInfo);
userRouter.post("/create", validateToken, validateUserCreate, UserController.create);
userRouter.delete("/delete/:id", validateToken, validateId ,UserController.delete);
userRouter.patch("/update/:id", validateToken, validateId, uploadImage ,validateUserUpdate, UserController.update);
