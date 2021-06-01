const Router = require('express')
const router = new Router()
const TestController = require('../../controllers/lessonTypes/test.controller')

router.post('/create/:lessonId', TestController.create)
router.patch('/update/:id', TestController.update)
router.get('/:id', TestController.getOne)

module.exports = router
