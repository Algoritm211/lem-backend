const consola = require('consola')
const User = require('../models/User')
const bcrypt = require('bcrypt')
const JWT = require('jsonwebtoken')

const cookieOptions = {
  secure: true,
  maxAge: 24 * 60 * 60 * 1000,
  sameSite: 'none',
}

class AuthController {
  async registration(req, res) {
    try {
      const { email, name, password } = req.body

      const user = await User.findOne({ email: email })

      if (user) {
        return res.status(400).json({ message: `Користувач з поштою ${email} вже існує` })
      }

      const hashPassword = await bcrypt.hash(password, 8)
      const newUser = new User({
        email: email,
        password: hashPassword,
        name: name,
      })
      await newUser.save()
      const token = await JWT.sign({ id: newUser._id }, process.env.secretKey, {})
      res.cookie('authToken', token, cookieOptions)
      return res.status(200).json({
        token: token,
        user: newUser,
      })
    } catch (error) {
      consola.error(error)
      return res.status(500).json({ message: 'Can not register user' })
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body

      const user = await User.findOne({ email: email })

      if (!user) {
        return res.status(400).json({ message: 'Такого користувача не існує' })
      }

      const isPasswordValid = await bcrypt.compare(password, user.password)

      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Неправильний логін або пароль' })
      }

      const token = await JWT.sign({ id: user._id }, process.env.secretKey, {})
      res.cookie('authToken', token, cookieOptions)

      return res.status(200).json({
        token: token,
        user: user,
      })
    } catch (error) {
      consola.error(error)
      return res.status(500).json({ message: 'Error during the login' })
    }
  }

  async authenticate(req, res) {
    try {
      const { user } = req
      return res.status(200).json({
        user: user,
      })
    } catch (error) {
      consola.error(error)
      return res.status(500).json({ message: 'Can not auth user' })
    }
  }

  async logout(req, res) {
    if (!req.cookies['authToken']) {
      return res.status(400).json({
        status: 'error',
        message: `You're already out`,
      })
    }
    res.clearCookie('authToken')

    return res.json({
      message: 'Logout successfully',
    })
  }

  async socialAuth(req, res) {
    try {
      const { authInfo, user } = req
      if (authInfo.statusCode !== 200 && authInfo.statusCode !== 404) {
        console.log(authInfo.statusCode)
        return res.status(500).json({ message: 'Auth Failed' })
      }

      let userInfo = user

      if (authInfo.statusCode === 404) {
        userInfo = new User({ ...user })
        await userInfo.save()
      }

      const token = await JWT.sign({ id: userInfo._id }, process.env.secretKey, {})
      res.cookie('authToken', token, cookieOptions)
      return res.send(
        `<script>window.opener.postMessage('${JSON.stringify({ token, user: userInfo })}', '*');window.close();</script>`,
      )
    } catch (error) {
      consola.error(error)
      return res.status(500).json({ message: 'Auth Failed' })
    }
  }
}


module.exports = new AuthController()
