const Router = require('express')
const router = new Router()
const TextController = require('../../controllers/lessonTypes/text.controller')

router.post('/create/:lessonId', TextController.create)
router.patch('/update/:id', TextController.update)
router.get('/:id', TextController.getOne)

module.exports = router
