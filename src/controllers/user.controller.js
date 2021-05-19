const User = require('../models/User')
const bcrypt = require('bcryptjs')
const path = require('path')
const fs = require('fs')
const consola = require('consola')

class UserController {
  async updateUser(req, res) {
    try {
      // all fields in update updateObj must be named like User model fields
      const updateObj = req.body
      if (updateObj.password) {
        updateObj.password = await bcrypt.hash(updateObj.password, 8)
      }
      const user = await User.findOneAndUpdate(
        { _id: req.user.id },
        updateObj,
        { new: true },
      )
      return res.status(200).json({ user })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Error. Can not update user' })
    }
  }

  async getOne(req, res) {
    try {
      const { id } = req.params
      const user = await User.findOne({ _id: id }).populate('courses')
      console.log(user)
    } catch (error) {
      consola.error(error)
      return res.status(500).json({ message: 'Can not get user' })
    }
  }

  async uploadAvatar(req, res) {
    try {
      const { photo } = req.files
      const photoName = Date.now() + photo.name
      const newPhotoPath = path.join(req.staticPath, photoName)

      const user = await User.findOne({ _id: req.user.id })
      if (user.avatar) {
        const oldPhotoPath = path.join(req.staticPath, user.avatar)
        if (fs.existsSync(oldPhotoPath) && oldPhotoPath !== req.staticPath) {
          fs.unlinkSync(oldPhotoPath)
        }
      }
      user.avatar = photoName
      await photo.mv(newPhotoPath)
      await user.save()

      return res.status(201).json({
        user: user,
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Fail while uploading avatar' })
    }
  }

  async deleteAvatar(req, res) {
    try {
      const user = await User.findOne({ _id: req.user.id })
      const filePath = path.join(req.staticPath, user.avatar)
      user.avatar = ''
      await user.save()

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
        return res.status(200).json({ message: 'Deleting successfully', user: user })
      }
      return res.status(200).json({ message: 'File was not found', user: user })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Error while deleting avatar' })
    }
  }

  async deleteAccount(req, res) {
    try {
      const user = await User.findOne({ _id: req.user.id })
      const filePath = path.join(req.staticPath, user?.avatar || 'photo')

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
      }
      await user.remove()
      return res.status(200).json({ message: 'Deleted successfully' })
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Can not delete account' })
    }
  }
}

module.exports = new UserController()
