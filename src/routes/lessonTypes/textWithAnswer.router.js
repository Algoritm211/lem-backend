const Router = require('express')
const router = new Router()
const TextWithAnswerController = require('../../controllers/lessonTypes/textWithAnswer.controller')

router.post('/create/:lessonId', TextWithAnswerController.create)
router.patch('/update/:id', TextWithAnswerController.update)
router.get('/:id', TextWithAnswerController.getOne)

module.exports = router
