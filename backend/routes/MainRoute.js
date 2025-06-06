import { Router } from "express";

export const mainRouter = Router();

mainRouter.get('/', (req, res) => {
    res.send('Hello World!')
})
