const Router = require('express')
const UserController = require('../controllers/user.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const router = new Router()


router.get('/:id', authMiddleware, UserController.getOne)

module.exports = router
