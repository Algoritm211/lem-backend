const Router = require('express')
const router = new Router()
const TextController = require('../../controllers/lessonTypes/text.controller')

router.post('/delete_birthday/', TextController.create)

module.exports = router
