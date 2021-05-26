const Router = require('express')
const router = new Router()
const TextController = require('../../controllers/lessonTypes/text.controller')

router.post('/create/:id', TextController.create)
router.patch('/update/:id', TextController.update)

module.exports = router
