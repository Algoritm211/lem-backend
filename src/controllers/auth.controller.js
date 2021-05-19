const consola = require('consola')
const User = require('../models/User')
const bcrypt = require('bcrypt')
const JWT = require('jsonwebtoken')


class AuthController {
  async registration(req, res) {
    try {
      const { email, name, password, role } = req.body

      const user = await User.findOne({ email: email })

      if (user) {
        return res.status(400).json({ message: `Користувач з поштою ${email} вже існує` })
      }

      const hashPassword = await bcrypt.hash(password, 8)
      const newUser = new User({
        email: email,
        password: hashPassword,
        name: name,
        surName: '',
        age: '',
        birthdayDate: '',
        role: role,
      })
      await newUser.save()
      const token = await JWT.sign({ id: newUser._id }, process.env.secretKey, {})
      res.cookie('authToken', token, { secure: true, maxAge: 24 * 60 * 60 * 1000, sameSite: 'none' })
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
      res.cookie('authToken', token, { secure: true, maxAge: 24 * 60 * 60 * 1000, sameSite: 'none' })
      // res.header('Set-Cookie', [
      //   `authToken=${token}; SameSite=None; path=/; Expires=${new Date(Date.now() + 86400e3)}`,
      // ])

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
}


module.exports = new AuthController()
