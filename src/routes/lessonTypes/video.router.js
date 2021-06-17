const Router = require('express')
const router = new Router()
const VideoController = require('../../controllers/lessonTypes/video.controller')
const authMiddleware = require('../../middlewares/auth.middleware')

router.post('/create/:lessonId', authMiddleware, VideoController.create)
router.patch('/update/:id', authMiddleware, VideoController.update)
router.get('/:id', VideoController.getOne)

module.exports = router
