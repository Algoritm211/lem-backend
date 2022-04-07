const Router = require('express')
const router = new Router()
const CodeController = require('../../controllers/lessonTypes/code.controller')

router.post('/create/:lessonId', CodeController.create)
router.patch('/update/:id', CodeController.update)
router.get('/:id', CodeController.getOne)
router.post('/check', CodeController.checkCode)

module.exports = router
