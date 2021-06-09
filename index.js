const express = require('express')
const cors = require('cors')
const consola = require('consola')
const dotenv = require('dotenv')
dotenv.config()
const fileUpload = require('express-fileupload')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const passport = require('passport')

const authRouter = require('./src/routes/auth.routes')
const courseRouter = require('./src/routes/course.routes')
const userRouter = require('./src/routes/user.routes')
const lessonRouter = require('./src/routes/lesson.routes')
const lessonTextRouter = require('./src/routes/lessonTypes/text.router')
const lessonVideoRouter = require('./src/routes/lessonTypes/video.router')
const lessonTextWithAnswerRouter = require('./src/routes/lessonTypes/textWithAnswer.router')
const lessonTestRouter = require('./src/routes/lessonTypes/test.router')

const app = express()
const PORT = process.env.PORT || 5000


app.use(passport.initialize())
app.use(cookieParser())
app.use(cors({
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  origin: ['http://localhost:3000', 'https://platform-lem.vercel.app'],
}))

app.use(express.json())
app.use(fileUpload({}))

app.use('/api/auth/', authRouter)
app.use('/api/course/', courseRouter)
app.use('/api/user/', userRouter)
app.use('/api/lesson/', lessonRouter)
app.use('/api/lesson/text/', lessonTextRouter)
app.use('/api/lesson/textanswer/', lessonTextWithAnswerRouter)
app.use('/api/lesson/video/', lessonVideoRouter)
app.use('/api/lesson/test/', lessonTestRouter)


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
