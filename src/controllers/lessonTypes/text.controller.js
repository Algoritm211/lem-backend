const consola = require('consola')
const Text = require('../../models/lessonTypes/Text')
const Lesson = require('../../models/Lesson')

class TextController {
  async create(req, res) {
    try {
      const { lessonId } = req.params
      const newTextStep = new Text({
        lesson: lessonId,
        body: '<p>Generated text by robot</p>',
      })
      const lesson = await Lesson.findOne({ _id: lessonId })
      lesson.steps.push({ stepId: newTextStep._id, stepModel: 'Text' })
      await newTextStep.save()
      await lesson.save()
      return res.status(201).json({
        step: lesson.steps[lesson.steps.length - 1],
      })
    } catch (error) {
      consola.error(error)
      return res.status(500).json({ message: 'Can not create text lesson' })
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params
      const { body } = req.body
      const textStep = await Text.findOne({ _id: id })
      textStep.body = body
      await textStep.save()
      return res.status(200).json({
        step: textStep,
      })
    } catch (error) {
      consola.error(error)
      return res.status(500).json({ message: 'Can not update text lesson' })
    }
  }

  async getOne(req, res) {
    try {
      const { id } = req.params
      const textLesson = await Text.findOne({ _id: id })
      return res.status(200).json({
        step: textLesson,
      })
    } catch (error) {
      consola.error(error)
      return res.status(500).json({ message: 'Can not get text lesson' })
    }
  }
}


module.exports = new TextController()

