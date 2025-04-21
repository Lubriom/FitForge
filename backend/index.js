import Express from "express";
import { mainRouter } from "./routes/route.js";
import { userRouter } from "./routes/users.js"; 
import { corsMiddleware } from "./middlewares/cors.js";

const app = Express()
const PORT = process.env.PORT ?? 8081

app.disable('x-powered-by')
app.use(corsMiddleware())

app.use('/', mainRouter)
app.use('/users', userRouter)
app.use((req, res) => {
    res.status(404).send('<h1>Error 404 not found</h1>')
})

app.listen(PORT, () => {
    console.log(`Example app listening on port http://localhost:${PORT}`)
})