import { Router } from "express";
import { UserController } from "../controllers/UsersController.js";
import { validateId } from "../middlewares/validateId.js";
import { validateUserCreate } from "../middlewares/validatedUser.js";
import { validateUserUpdate } from "../middlewares/validatedUserUpdate.js";
import { validateInfo } from "../middlewares/validateInfo.js";
import { validateStats } from "../middlewares/validateStats.js";
import { validateToken } from "../middlewares/validateToken.js";
import { InfoController } from "../controllers/InfoController.js";
import { uploadImage } from "../middlewares/validateImage.js";
import { validateRole } from "../middlewares/validateRoles.js";

export const userRouter = Router();

userRouter.get("/get", validateToken, UserController.getAll);
userRouter.get("/paginate", validateToken, UserController.getPaginate);
userRouter.get("/get/:id", validateToken, validateId, UserController.getById);
userRouter.get("/get/:id/info/all", validateToken, validateId, InfoController.getAll);
userRouter.get("/get/:id/info/last", validateToken, validateId, InfoController.getLast);
userRouter.get("/get/metrics/:id", validateToken, validateId, InfoController.getMetricas);
userRouter.get("/get/:id/patologias", validateToken, validateId, InfoController.getPatologias);
userRouter.get("/get/:id/estadisticas", validateToken, validateId, InfoController.getEstadisticas);

userRouter.post("/start", validateToken, validateInfo, InfoController.updateInfo);
userRouter.post("/create", validateToken, validateUserCreate, UserController.create);
userRouter.post("/stats/register", validateToken, validateStats, InfoController.updateInfo);

userRouter.delete("/delete/:id", validateToken, validateRole("admin"), validateId ,UserController.delete);

userRouter.patch("/update/:id", validateToken, validateId, uploadImage ,validateUserUpdate, UserController.update);