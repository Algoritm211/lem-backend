const Router = require('express')
const router = new Router()
const VideoController = require('../../controllers/lessonTypes/video.controller')

router.post('/create/:lessonId', VideoController.create)
router.patch('/update/:id', VideoController.update)
router.get('/:id', VideoController.getOne)

module.exports = router
