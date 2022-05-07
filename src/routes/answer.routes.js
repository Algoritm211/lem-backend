const Router = require('express')
const AnswerController = require('../controllers/answer.controller')
const authMiddleware = require('../middlewares/auth.middleware')

const router = new Router()

router.get('/single/:stepId', authMiddleware, AnswerController.getAnswer)
router.get('/:courseId', AnswerController.getAnswersByCourse)
router.post('', AnswerController.addNewAnswer)


module.exports = router
