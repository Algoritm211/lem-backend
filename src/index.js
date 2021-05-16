const express = require('express')
const cors = require('cors')
const consola = require('consola')
const dotenv = require('dotenv')
dotenv.config()
const cookieParser = require( 'cookie-parser')
const mongoose = require('mongoose')
const passport = require('passport')

const authRouter = require('./routes/auth.routes')

const app = express()
const PORT = process.env.PORT || 5000

app.use(passport.initialize())
app.use(cookieParser())
app.use(cors({
  withCredentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  origin: '*',
}))
app.use(express.json())


app.use('/api/auth/', authRouter)


const start = async () => {
  try {
    const dbURL = process.env.dbURL
    await mongoose
      .connect(dbURL, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        tls: true,
      })
    consola.success('Database connected')
    app.listen(PORT, () => {
      consola.success(`Server started on http://localhost:${PORT}`)
    })
  } catch (error) {
    consola.error(error)
  }
}

start()
