import { Router } from "express";
import { UserModel } from "../models/user.js";

export const userRouter = Router();

userRouter.get("/", async (req, res) => {
  const users = await UserModel.getAll();
  if (users) return res.json(users);
});

userRouter.get("/:id", async (req, res) => {
  const {id} = req.params;
  const user = await UserModel.getById({id});

  if (user) return res.json(user);

  res.status(404).send("<h1>Error 404 usuarios no encontrados</h1>");
});
