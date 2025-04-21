import Express from "express";

const app = Express()
const PORT = 8081

app.disable('x-powered-by')

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.use((req, res) => {
    res.status(404).send('<h1>Error 404 not found</h1>')
})

app.listen(PORT, () => {
    console.log(`Example app listening on port http://localhost:${PORT}`)
})