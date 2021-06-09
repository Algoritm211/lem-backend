const consola = require('consola')
const Course = require('../models/Course')
const Lesson = require('../models/Lesson')
const Text = require('../models/lessonTypes/Text')
const Video = require('../models/lessonTypes/Video')
const LessonService = require('../services/lesson.service')

const lessonStepsTypes = {
  Text: Text,
  Video: Video,
}

class LessonController {
  async create(req, res) {
    try {
      const { courseId } = req.params
      const course = await Course.findOne({ _id: courseId })
      const lesson = await LessonService.create(courseId)
      course.lessons.push(lesson._id)
      await course.save()
      return res.status(200).json({
        lesson,
      })
    } catch (error) {
      consola.error(error)
      return res.status(500).json({ message: 'Can not create lesson' })
    }
  }

  async getCourseLessons(req, res) {
    try {
      const { id } = req.params
      const course = await Course.findOne({ _id: id }).populate('lessons')
      return res.status(200).json({
        course: course,
        lessons: course.lessons,
      })
    } catch (error) {
      consola.error(error)
      return res.status(500).json({ message: 'Can not get lessons' })
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params
      const lesson = await Lesson.findOne({ _id: id })
      await Course.findOneAndUpdate(
        { _id: lesson.course },
        { $pull: { lessons: lesson._id } },
      )
      const { steps } = await Lesson.findOne({ _id: id })
      for (let idx = 0; idx < steps.length; idx++) {
        await lessonStepsTypes[steps[idx]['stepModel']].deleteOne({ _id: steps[idx]['stepId'] })
      }
      await lesson.remove()
      return res.status(200).json({ message: 'Deleted successfully' })
    } catch (error) {
      consola.error(error)
      return res.status(500).json({ message: 'Can not delete message' })
    }
  }

  async getOne(req, res) {
    try {
      const { id } = req.params
      const lesson = await Lesson.findOne({ _id: id })
        .populate({ path: 'course', populate: 'author' })
        .populate({ path: 'steps' })

      return res.status(200).json({
        lesson: lesson,
        course: lesson.course,
      })
    } catch (error) {
      consola.error(error)
      return res.status(500).json({ message: 'Can not get Lesson' })
    }
  }

  async addLessonUserMark(req, res) {
    try {
      const { id } = req.params
      const userId = req.user.id
      const { mark, lessonStepId } = req.body
      const lesson = await Lesson.findOne({ _id: id })

      const student = lesson?.students?.find((student) => {
        return String(student.userId) === userId
      })

      if (student?.completedTests?.includes(lessonStepId)) {
        return res.status(500).json({ message: 'You have already answered on this question' })
      }

      if (!lesson.students || lesson.students.length === 0) {
        lesson.students = []
        lesson.students.push({ userId: userId, completedTests: [lessonStepId], mark: mark })
      }

      if (student) {
        student.mark += mark
        student.completedTests.push(lessonStepId)
      }

      await lesson.save()
      return res.status(200).json({
        lesson,
      })
    } catch (error) {
      consola.error(error)
      return res.status(500).json({ message: 'Can not add user Mark' })
    }
  }

  // updateObj may contains only fields in Lesson model
  async update(req, res) {
    try {
      const updateObj = req.body
      const { id } = req.params
      const updatedLesson = await Lesson.findByIdAndUpdate(
        { _id: id },
        updateObj,
        { new: true },
      ).populate('course').populate({ path: 'steps.stepId' })
      return res.status(200).json({
        lesson: updatedLesson,
      })
    } catch (error) {
      consola.error(error)
      return res.status(500).json({ message: 'Can not update lesson' })
    }
  }
}

module.exports = new LessonController()
