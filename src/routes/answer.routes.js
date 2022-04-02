const Router = require('express')
const AnswerController = require('../controllers/answer.controller')

const router = new Router()

router.get('/:courseId', AnswerController.getAnswersByCourse)
router.post('', AnswerController.addNewAnswer)


module.exports = router
