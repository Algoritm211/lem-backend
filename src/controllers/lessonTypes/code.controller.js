const consola = require('consola')
const Code = require('../../models/lessonTypes/Code')
const Lesson = require('../../models/Lesson')
const CodeService = require('../../services/code.service')

class CodeController {
  async create(req, res) {
    try {
      const { lessonId } = req.params
      const newStep = new Code({
        lesson: lessonId,
        body: 'Here you can type your exercise',
      })
      const lesson = await Lesson.findOne({ _id: lessonId })
      lesson.steps.push({ stepId: newStep._id, stepModel: 'Code' })
      await newStep.save()
      await lesson.save()
      return res.status(201).json({
        step: lesson.steps[lesson.steps.length - 1],
      })
    } catch (error) {
      consola.error(error)
      return res.status(500).json({ message: 'Can not create Code step' })
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params
      const { body, score, tests, answer } = req.body
      const codeStep = await Code.findOne({ _id: id })
      if (body && score && tests) {
        codeStep.body = body
        codeStep.score = score
        codeStep.tests = tests
      }

      if (answer) {
        codeStep.answer = answer
      }

      await codeStep.save()
      return res.status(200).json({
        step: codeStep,
      })
    } catch (error) {
      consola.error(error)
      return res.status(500).json({ message: 'Can not update Code step' })
    }
  }

  async getOne(req, res) {
    try {
      const { id } = req.params
      const codeStep = await Code.findOne({ _id: id })
      return res.status(200).json({
        step: codeStep,
      })
    } catch (error) {
      consola.error(error)
      return res.status(500).json({ message: 'Can not get Code step' })
    }
  }

  async checkCode(req, res) {
    try {
      const { code, language, tests } = req.body

      if (code.includes('sudo')) {
        return res.status(403).json({ err: 'No word `sudo` in code!' })
      }

      let isCodeValid = false

      if (language === 'JavaScript') {
        isCodeValid = await CodeService.runJSCode(code, tests)
      }

      if (language === 'Python') {
        isCodeValid = await CodeService.runPyCode(code, tests)
      }

      return res.status(200).json({ isCodeValid })
    } catch (error) {
      consola.error(error)
      return res.status(500).json({ message: 'Error while processing code' })
    }
  }
}


module.exports = new CodeController()
