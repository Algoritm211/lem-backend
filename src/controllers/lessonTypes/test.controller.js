const consola = require('consola')
const Test = require('../../models/lessonTypes/Test')
const Lesson = require('../../models/Lesson')

class TestController {
  async create(req, res) {
    try {
      const { lessonId } = req.params
      const mockData = {
        question: 'How are you?',
        options: ['Good', 'Amazing'],
        answers: ['Amazing'],
        type: 'single',
      }
      const { options, answers, question, type } = mockData // req.body
      const newTest = new Test({ options, answers, question, type })
      const lesson = await Lesson.findOne({ _id: lessonId })
      lesson.steps.push({ stepId: newTest._id, stepModel: 'Test' })
      await newTest.save()
      await lesson.save()
      return res.status(201).json({
        step: lesson.steps[lesson.steps.length - 1],
      })
    } catch (error) {
      consola.error(error)
      return res.status(500).json('Can not create test step')
    }
  }

  async update(req, res) {

  }

  async getOne(req, res) {
    try {
      const { id } = req.params
      const testLesson = await Test.findOne({ _id: id })
      return res.status(200).json({
        step: testLesson,
      })
    } catch (error) {
      consola.error(error)
      return res.status(500).json({ message: 'Can not get lesson' })
    }
  }
}


module.exports = new TestController()
