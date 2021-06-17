const Router = require('express')
const router = new Router()
const TextController = require('../../controllers/lessonTypes/text.controller')
const authMiddleware = require('../../middlewares/auth.middleware')

router.post('/create/:lessonId', authMiddleware, TextController.create)
router.patch('/update/:id', authMiddleware, TextController.update)
router.get('/:id', TextController.getOne)

module.exports = router
