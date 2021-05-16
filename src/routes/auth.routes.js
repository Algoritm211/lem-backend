const Router = require('express')
const authMiddleware = require('../middlewares/auth.middleware')
const AuthController = require('../controllers/auth.controller')

const router = new Router()


router.post('/registration', AuthController.registration)
router.post('/login', AuthController.login)
router.get('/auth', authMiddleware, AuthController.authenticate)


module.exports = router
