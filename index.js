import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
const __direname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__direname, './config/.env') })
import express from 'express'
import * as indexRouter from './src/module/index.router.js'
const app = express()
import connection from './DB/connection.js'
import { globalError } from './src/services/asyncHandler.js'
import cors  from "cors"

app.use(cors("*"))
const port = 3000
app.use(express.json())

app.use('/auth', indexRouter.authRouter)
app.use('/product', indexRouter.productRouter)

app.get('/', (req, res) => res.send('gallery apis!'))
app.use('*', (req, res, next) => {
    res.send("In-valid Route pls check url or method")
})
app.use(globalError)
connection()
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

