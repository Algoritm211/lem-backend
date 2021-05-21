const CourseController = require('../controllers/course.controller')
const Router = require('express')
const authMiddleware = require('../middlewares/auth.middleware')
const router = new Router()

router.get('/subscribe', authMiddleware, CourseController.subscribeToCourse)
router.get('/user', authMiddleware, CourseController.getUserCourses)
router.delete('/subscribe', authMiddleware, CourseController.unsubscribeCourse)
router.post('/create', authMiddleware, CourseController.createCourses)
router.get('', CourseController.getAllCourses)
router.get('/like', authMiddleware, CourseController.toggleLike)
router.get('/:id', CourseController.getOne)

module.exports = router
