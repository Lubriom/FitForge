import Express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { mainRouter } from "./routes/route.js";
import { userRouter } from "./routes/UsersRoute.js"; 
import { authRouter } from "./routes/AuthRoute.js"; 
import { corsMiddleware } from "./middlewares/cors.js";
import { trainRouter } from "./routes/TrainRoute.js";
import { imageRouter } from "./routes/ImageRoute.js";
import { exerciseRouter } from "./routes/ExercisesRoute.js";

const app = Express()
const PORT = process.env.PORT ?? 8081

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.disable('x-powered-by')
app.use(corsMiddleware())
app.use(Express.json())

app.use('/', mainRouter)
app.use('/', authRouter)
app.use('/users', userRouter)
app.use('/trains', trainRouter)
app.use('/images', imageRouter)
app.use('/exercises', exerciseRouter)
app.use('/pfp', Express.static(path.join(__dirname, 'public/uploads/pfp')));
app.use((req, res) => {
    res.status(404).send('<h1>Error 404 not found</h1>')
})

app.listen(PORT, () => {
    console.log(`Example app listening on port http://localhost:${PORT}`)
})