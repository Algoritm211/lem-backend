const Router = require('express')
const router = new Router()
const LessonController = require('../controllers/lesson.controller')
const authMiddleware = require('../middlewares/auth.middleware')

router.post('/create/:courseId', LessonController.create)
router.patch('/update/:id', LessonController.update)
router.post('/mark/:id', authMiddleware, LessonController.addLessonUserMark)
router.get('/:id', LessonController.getCourseLessons)
router.get('/one/:id', LessonController.getOne)
router.delete('/:id', LessonController.delete)

module.exports = router
