const Answer = require('../models/Answer')
const Course = require('../models/Course')
const consola = require('consola')

class AnswerController {
  async addNewAnswer(req, res) {
    try {
      const { text, score, stepType, stepId: step, userId: user } = req.body

      const newAnswer = new Answer({
        text: text || '',
        score: score || 0,
        step,
        stepType,
        user,
      })

      await newAnswer.save()
      return res.status(201).json({
        answer: newAnswer,
        message: 'Answer created successfully',
      })
    } catch (error) {
      consola.error(error)
      return res.status(500).json({ message: 'Error while adding answer' })
    }
  }

  async getAnswersByCourse(req, res) {
    try {
      const { courseId } = req.query

      const coursesWithSteps = await Course.findOne({
        _id: courseId,
      })
        .populate('students', ['name', 'surName'])
        .populate({
          path: 'lessons',
          populate: {
            path: 'steps',
          },
        }).select('lessons')

      const allCourseStepIds = coursesWithSteps
        .lessons
        .flatMap((lesson) => lesson.steps)
        .map((step) => step.stepId)

      const answers = await Answer.find({ step: { $in: allCourseStepIds } })
        .populate({
          path: 'step',
          populate: {
            path: 'lesson',
            select: ['title', 'course'],
            populate: {
              path: 'course',
              select: ['title'],
            },
          },
        })
        .populate({
          path: 'user',
          select: ['name', 'surName'],
        })

      // Transforming users and their marks
      const userWithAnswers = {}

      answers.forEach((answer, index) => {
        if (userWithAnswers.hasOwnProperty(answer.user._id)) {
          userWithAnswers[answer.user._id][answer.step._id] = answer.score
          userWithAnswers[answer.user._id].totalScore += answer.score
        } else {
          userWithAnswers[answer.user._id] = {
            name: `${answer.user.name} ${answer.user.surName}`,
            userId: answer.user._id,
            totalScore: answer.score,
            [answer.step._id]: answer.score,
          }
        }
      })

      const tableData = Object.values(userWithAnswers)

      // Transforming courses
      const columnsData = [
        {
          title: 'UserId',
          dataIndex: 'userId',
          key: 'userId',
        },
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: 'Score',
          dataIndex: 'totalScore',
          key: 'totalScore',
        },
      ]

      const coursesObj = {}

      answers.forEach((answer) => {
        if (coursesObj.hasOwnProperty(answer.step.lesson._id)) {
          coursesObj[answer.step.lesson._id].children.push({
            title: `Q${coursesObj[answer.step.lesson._id].children.length + 1}`,
            dataIndex: answer.step._id,
          })
        } else {
          coursesObj[answer.step.lesson._id] = {
            title: answer.step.lesson.title,
            children: [{
              title: 'Q1',
              dataIndex: answer.step._id,
            }],
          }
        }
      })


      columnsData.push(...Object.values(coursesObj))

      return res.status(200).json({
        columnsData,
        tableData,
      })
    } catch (error) {
      consola.error(error)
      return res.status(500).json({ message: 'Error getting answers by course' })
    }
  }
}


module.exports = new AnswerController()
