const Lesson = require('../../models/Lesson')
const Video = require('../../models/lessonTypes/Video')
const consola = require('consola')

class VideoController {
  async create(req, res) {
    try {
      const { lessonId } = req.params
      const { url } = req.body
      const newVideoStep = new Video({
        lesson: lessonId,
        url: url,
      })
      const lesson = await Lesson.findOne({ _id: lessonId })
      lesson.steps.push({ stepId: newVideoStep._id, stepModel: 'Text' })
      await newVideoStep.save()
      await lesson.save()
      return res.status(201).json({
        step: newVideoStep,
      })
    } catch (error) {
      consola.error(error)
      return res.status(500).json({ message: 'Can not create video lesson' })
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params
      const { url } = req.body
      const videoLesson = await Video.findOne({ _id: id })
      videoLesson.url = url
      await videoLesson.save()
      return res.status(200).json({
        lesson: videoLesson,
      })
    } catch (error) {
      consola.error(error)
      return res.status(500).json({ message: 'Can not update video lesson' })
    }
  }
}

module.exports = new VideoController()