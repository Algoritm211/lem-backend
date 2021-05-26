const Router = require('express')
const router = new Router()
const VideoController = require('../../controllers/lessonTypes/video.controller')

router.post('/create/:id', VideoController.create)
router.patch('/update/:id', VideoController.update)

module.exports = router
