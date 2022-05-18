const Lesson = require('../../models/Lesson')
const Video = require('../../models/lessonTypes/Video')
const consola = require('consola')
const Text = require('../../models/lessonTypes/Text')

class VideoController {
  async create(req, res) {
    try {
      const { lessonId } = req.params
      const newVideoStep = new Video({
        lesson: lessonId,
        url: 'here paste your YouTube URL, add embed link of your video',
      })
      const lesson = await Lesson.findOne({ _id: lessonId })
      lesson.steps.push({ stepId: newVideoStep._id, stepModel: 'Video' })
      await newVideoStep.save()
      await lesson.save()
      return res.status(201).json({
        step: lesson.steps[lesson.steps.length - 1],
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

  async delete(req, res) {
    try {
      const { id } = req.params
      const videoStep = await Video.findOne({ _id: id })
      const lesson = await Lesson.findOne({ _id: videoStep.lesson })
      lesson.steps = lesson.steps.filter((item) => item.stepId.toString() !== id.toString())
      await lesson.save()
      await videoStep.deleteOne()
      return res.status(200).json({ lessonData: lesson })
    } catch (error) {
      consola.error(error)
      return res.status(500).json({ message: 'Can not delete step' })
    }
  }


  async getOne(req, res) {
    try {
      const { id } = req.params
      const videoLesson = await Video.findOne({ _id: id })
      return res.status(200).json({
        step: videoLesson,
      })
    } catch (error) {
      consola.error(error)
      return res.status(500).json({ message: 'Can not get video lesson' })
    }
  }
}

module.exports = new VideoController()
