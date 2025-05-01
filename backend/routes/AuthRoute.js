import Router from "express";
import { AuthController } from "../controllers/AuthController.js";
import { validateLogin } from "../middlewares/validateLogin.js";

export const authRouter = Router();

authRouter.post("/login", validateLogin, AuthController.login);
authRouter.post("/register", AuthController.register);
