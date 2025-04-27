import Router from "express";
import { AuthController } from "../controllers/AuthController.js";

export const authRouter = Router();

authRouter.post("/login", AuthController.login);
authRouter.post("/register", AuthController.register);
