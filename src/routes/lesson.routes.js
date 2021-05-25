const Router = require('express')
const router = new Router()
const LessonController = require('../controllers/lesson.controller')

router.post('/create/:courseId', LessonController.create)
router.patch('/update/:id', LessonController.update)
router.get('/:id', LessonController.getCourseLessons)
router.get('/one/:id', LessonController.getOne)
router.delete('/:id', LessonController.delete)

module.exports = router
