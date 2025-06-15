import Router from "express";
import { AuthController } from "../controllers/AuthController.js";
import { validateLogin } from "../middlewares/validateLogin.js";
import { validateRegister } from "../middlewares/validateRegister.js";
import { validateToken } from "../middlewares/validateToken.js";

export const authRouter = Router();

authRouter.post("/login", validateLogin, AuthController.login);
authRouter.post("/register", validateRegister, AuthController.register);
authRouter.post("/refresh-token", validateToken , AuthController.refreshToken);
