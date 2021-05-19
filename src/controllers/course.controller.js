const Course = require('../models/Course')
const Lesson = require('../models/Lesson')
const User = require('../models/User')
const consola = require('consola')

class CourseController {
  async createCourses(req, res) {
    try {
      const { title, description, category } = req.body

      const course = new Course({
        author: req.user.id, // from auth.middleware
        title: title,
        category: category,
        description: description,
        rating: 0,
        isReady: false,
      })
      const lessonsPreparingArr = [1].fill({ title: '', body: '', homeWork: '', course: course._id })
      const lessons = await Lesson.insertMany(lessonsPreparingArr)
      const user = await User.findOne({ _id: req.user.id })
      user.coursesAuthor.push(course._id)
      lessons.forEach((lesson) => {
        course.lessons.push(lesson._id)
      })
      await course.save()
      await user.save()

      return res.status(201).json({
        course: course,
        message: 'Course was created successfully',
      })
    } catch (error) {
      consola.error(error)
      return res.status(500).json({ message: 'Error while adding courses' })
    }
  }

  async getAllCourses(req, res) {
    try {
      const { page, filters: rawFilters } = req.query
      const COURSES_ON_PAGE = 6

      const pageFilters = rawFilters ? rawFilters.split(',') : ['design', 'all', 'business', 'education', 'marketing', 'it']

      let filterParam = { category: { $in: pageFilters }, isReady: { $ne: false } }
      if (pageFilters.length === 0 || pageFilters[0] === '') {
        filterParam = { isReady: { $ne: false } }
      }

      const courses = await Course.find(filterParam)
        .populate('author')
        .skip(Number(page - 1) * COURSES_ON_PAGE)
        .limit(6)
      const coursesCount = await Course.countDocuments(filterParam)
      return res.status(200).json({
        coursesCount: coursesCount,
        courses: courses,
      })
    } catch (error) {
      consola.error(error)
      return res.status(500).json({ message: 'Can not get courses' })
    }
  }

  async getOne(req, res) {
    try {
      const { id } = req.params
      const course = await Course.findOne({ _id: id }).populate('author')
      return res.status(200).json({
        course: course,
      })
    } catch (error) {
      consola.error(error)
      return res.status(500).json({ message: 'Error while getting course' })
    }
  }

  async deleteCourse(req, res) {
    try {
      const { courseId } = req.query
      const course = await Course.findOne({ _id: courseId })

      await Lesson.deleteMany({ course: { _id: courseId } })

      const user = await User.findOneAndUpdate(
        { _id: req.user.id },
        { $pull: { coursesAuthor: courseId } },
        { new: true },
      )

      await course.remove()
      return res.status(200).json({
        message: 'Course deleted successfully',
        user: user,
        course: course,
      })
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Can not delete course' })
    }
  }
}


module.exports = new CourseController()
