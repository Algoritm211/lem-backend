const Router = require('express')
const router = new Router()
const TestController = require('../../controllers/lessonTypes/test.controller')
const authMiddleware = require('../../middlewares/auth.middleware')

router.post('/create/:lessonId', authMiddleware, TestController.create)
router.patch('/update/:id', authMiddleware, TestController.update)
router.get('/:id', TestController.getOne)

module.exports = router
