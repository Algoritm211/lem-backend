const CourseController = require('../controllers/course.controller')
const Router = require('express')
const authMiddleware = require('../middlewares/auth.middleware')
const router = new Router()

router.post('/create', authMiddleware, CourseController.createCourses)
router.get('', CourseController.getAllCourses)
router.get('/:id', CourseController.getOne)

module.exports = router
