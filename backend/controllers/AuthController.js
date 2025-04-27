import bcrypt from "bcryptjs";
import { UserModel } from "../models/User.js";

export class AuthController {
    static async login(req, res) {
        // try {
        //     const { email, password } = req.body;
        //     const user = await UserModel.login({ email, password });
        //     return res.json(user);
        // } catch (error) {
        //     console.error("Error al iniciar sesión:", error);
        //     return res.status(500).send("Error al iniciar sesión");
        // }
    }

    static async register(req, res) {

    }
}