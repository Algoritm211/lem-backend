import express from 'express'
import cors from "cors";
import consola from "consola";
import dotenv from 'dotenv'
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({
  withCredentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  origin: '*'
}))


const START = () => {
  try {
    app.listen(PORT, () => {
      consola.success(`Server started on http://localhost:${PORT}`)
    })
  } catch (error) {
    consola.error(error)
  }
}

START()
