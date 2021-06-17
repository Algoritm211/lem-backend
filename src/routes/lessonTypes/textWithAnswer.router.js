const Router = require('express')
const router = new Router()
const TextWithAnswerController = require('../../controllers/lessonTypes/textWithAnswer.controller')
const authMiddleware = require('../../middlewares/auth.middleware')

router.post('/create/:lessonId', authMiddleware, TextWithAnswerController.create)
router.patch('/update/:id', authMiddleware, TextWithAnswerController.update)
router.get('/:id', TextWithAnswerController.getOne)

module.exports = router
