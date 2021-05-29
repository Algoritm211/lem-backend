const consola = require('consola')
const Lesson = require('../../models/Lesson')
const TextWithAnswer = require('../../models/lessonTypes/TextWithAnswer')

class TextWithAnswerController {
  async create(req, res) {
    try {
      const { lessonId } = req.params
      const newStep = new TextWithAnswer({
        lesson: lessonId,
        body: 'Here you can type your exercise',
      })
      const lesson = await Lesson.findOne({ _id: lessonId })
      lesson.steps.push({ stepId: newStep._id, stepModel: 'TextWithAnswer' })
      await newStep.save()
      await lesson.save()
      return res.status(201).json({
        step: lesson.steps[lesson.steps.length - 1],
      })
    } catch (error) {
      consola.error(error)
      return res.status(500).json({ message: 'Can not create TextWithAnswer step' })
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params
      const { body } = req.body
      const withAnswerStep = await TextWithAnswer.findOne({ _id: id })
      withAnswerStep.body = body
      await withAnswerStep.save()
      return res.status(200).json({
        lesson: withAnswerStep,
      })
    } catch (error) {
      consola.error(error)
      return res.status(500).json({ message: 'Can not update TextWithAnswer step' })
    }
  }

  async getOne(req, res) {
    try {
      const { id } = req.params
      const withAnswerStep = await TextWithAnswer.findOne({ _id: id })
      return res.status(200).json({
        step: withAnswerStep,
      })
    } catch (error) {
      consola.error(error)
      return res.status(500).json({ message: 'Can not get TextWithAnswer step' })
    }
  }
}

module.exports = new TextWithAnswerController()
