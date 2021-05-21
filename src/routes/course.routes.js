const CourseController = require('../controllers/course.controller')
const Router = require('express')
const authMiddleware = require('../middlewares/auth.middleware')
const router = new Router()

router.get('/subscribe', authMiddleware, CourseController.subscribe)
router.get('/user', authMiddleware, CourseController.getUserCourses)
router.delete('/subscribe', authMiddleware, CourseController.unsubscribe)
router.post('/create', authMiddleware, CourseController.create)
router.get('', CourseController.getAll)
router.get('/like', authMiddleware, CourseController.toggleLike)
router.get('/:id', CourseController.getOne)

module.exports = router
