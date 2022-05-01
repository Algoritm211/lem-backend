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
      const { body, score, language, tests, answer } = req.body
      const codeStep = await Code.findOne({ _id: id })
      if (score && tests) {
        codeStep.score = score
        codeStep.tests = tests
        codeStep.language = language
      }

      if (body) {
        codeStep.body = body
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

      if (language === 'nodejs') {
        const data = await CodeService.runJSCode(code, tests)
        return res.status(200).json({ ...data })
      }

      if (language === 'python3') {
        const data = await CodeService.runPythonCode(code, tests)
        return res.status(200).json({ ...data })
      }

      return res.status(200).json({ message: 'This language is not available' })
    } catch (error) {
      consola.error(error)
      return res.status(500).json({ message: 'Error while processing code' })
    }
  }
}


module.exports = new CodeController()
