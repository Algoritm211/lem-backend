const Router = require('express')
const UserController = require('../controllers/user.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const router = new Router()

router.patch('/update', authMiddleware, UserController.updateUser)
router.post('/avatar', authMiddleware, UserController.uploadAvatar)
router.delete('/avatar', authMiddleware, UserController.deleteAvatar)
router.patch('/addcompletedstep', authMiddleware, UserController.addStepToCompleted)
router.get('/:id', authMiddleware, UserController.getOne)

module.exports = router
