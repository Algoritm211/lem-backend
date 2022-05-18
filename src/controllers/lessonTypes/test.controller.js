const consola = require('consola')
const Test = require('../../models/lessonTypes/Test')
const Lesson = require('../../models/Lesson')

class TestController {
  async create(req, res) {
    try {
      const { lessonId } = req.params
      const mockData = {
        question: 'Your Question',
        options: ['Variant 1'],
        answers: ['Variant 1'],
        userAnswers: [],
        type: 'single',
        lesson: lessonId,
      }
      const { options, answers, question, type, lesson: boundLesson } = mockData
      const newTest = new Test({ options, answers, question, type, lesson: boundLesson })
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
    try {
      const { id } = req.params
      const { options, answers, question, type, score } = req.body
      const testStep = await Test.findOneAndUpdate(
        { _id: id },
        { options, answers, question, type, score },
        { new: true },
      )
      return res.status(200).json({
        step: testStep,
      })
    } catch (error) {
      consola.error(error)
      return res.status(500).json({ message: 'Can not update test step' })
    }
  }

  async addUserAnswer(req, res) {
    try {
      const { id } = req.params
      const { userAnswers } = req.body
      const testStep = await Test.findOneAndUpdate(
        { _id: id },
        { userAnswers },
        { new: true, upsert: true },
      )
      return res.status(200).json({
        step: testStep,
      })
    } catch (error) {
      consola.error(error)
      return res.status(500).json({ message: 'Can not add user`s answer' })
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params
      const testStep = await Test.findOne({ _id: id })
      const lesson = await Lesson.findOne({ _id: testStep.lesson })
      lesson.steps = lesson.steps.filter((item) => item.stepId.toString() !== id.toString())
      await lesson.save()
      await testStep.deleteOne()
      return res.status(200).json({ lessonData: lesson })
    } catch (error) {
      consola.error(error)
      return res.status(500).json({ message: 'Can not delete step' })
    }
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
