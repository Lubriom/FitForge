import Router from "express";
import { ImageController } from "../controllers/ImageController.js";
import { validateToken } from "../middlewares/validateToken.js";

export const imageRouter = Router();

imageRouter.get("/pfp/:filename", validateToken, ImageController.getImage);
