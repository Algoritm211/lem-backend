const Course = require('../models/Course')
const Lesson = require('../models/Lesson')
const User = require('../models/User')
const CloudinaryService = require('../services/cloudinary.service')
const LessonService = require('../services/lesson.service')
const consola = require('consola')


class CourseController {
  async create(req, res) {
    try {
      const { title, description, subject } = req.body

      const course = new Course({
        author: req.user.id, // from auth.middleware
        title: title,
        subject: subject,
        description: description,
        coursePreview: {
          url: '',
          name: '',
        },
        rating: 0,
        isReady: false,
      })
      const lesson = await LessonService.create(course._id)
      course.lessons.push(lesson._id)
      const user = await User.findOne({ _id: req.user.id })
      user.coursesAuthor.push(course._id)
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

  async update(req, res) {
    try {
      const { title, description, about, id } = req.body
      const course = await Course.findOne({ _id: id })
      course.title = title
      course.description = description
      course.about = about
      await course.save()
      return res.status(201).json({ course })
    } catch (error) {
      consola.error(error)
      return res.status(500).json({ message: 'Can not update the course' })
    }
  }

  async getAll(req, res) {
    try {
      const { page, filters: rawFilters } = req.query
      const COURSES_ON_PAGE = 6

      const pageFilters = rawFilters ? rawFilters.split(',') : ['design', 'all', 'business', 'education', 'marketing', 'it']

      let filterParam = { subject: { $in: pageFilters }, isReady: { $ne: false } }
      if (pageFilters.length === 0 || pageFilters[0] === '') {
        filterParam = { isReady: { $ne: false } }
      }

      const courses = await Course.find(filterParam)
        .populate('author')
        .populate('lessons')
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

  async getUserCourses(req, res) {
    try {
      const user = await User.findOne({ _id: req.user.id })
        .populate({ path: 'courses', populate: { path: 'lessons' } })
        .populate({ path: 'courses', populate: { path: 'author' } })
        .populate({ path: 'coursesAuthor', populate: { path: 'author' } })
        .populate({ path: 'coursesAuthor', populate: { path: 'lessons' } })
      return res.status(200).json({
        coursesAuthor: user.coursesAuthor,
        courses: user.courses,
      })
    } catch (error) {
      consola.error(error)
      return res.status(500).json({ message: 'Error while getting user courses' })
    }
  }

  async updatePreview(req, res) {
    try {
      const { photo } = req.files
      const { id } = req.body
      const course = await Course.findOne({ _id: id })
      if (course?.coursePreview?.url) {
        await CloudinaryService.deletePhoto(course.coursePreview.name)
      }
      // eslint-disable-next-line camelcase
      const { url, public_id } = await CloudinaryService.uploadPhoto(photo.data, 'courses')
      course.coursePreview = {
        url: url,
        name: public_id,
      }
      await course.save()
      return res.status(201).json({
        course,
      })
    } catch (error) {
      consola.error(error)
      return res.status(500).json({ message: 'Can not update preview' })
    }
  }

  async toggleLike(req, res) {
    try {
      const { courseId } = req.query

      const user = await User.findOne({ _id: req.user.id })
      const course = await Course.findOne({ _id: courseId })
        .populate('author')
        .populate('lessons')
      if (user.likedCourses && user.likedCourses.includes(courseId)) {
        course.rating = course.rating - 1
        user.likedCourses.remove(course._id)
      } else {
        course.rating = course.rating + 1
        user.likedCourses.push(course._id)
      }

      await course.save()
      await user.save()
      return res.status(200).json({
        course: course,
        user: user,
      })
    } catch (error) {
      consola.error(error)
      return res.status(500).json({ message: 'Can not like course' })
    }
  }

  async subscribe(req, res) {
    try {
      const { courseId } = req.query
      const user = await User.findOne({ _id: req.user.id })
      const course = await Course.findOne({ _id: courseId })
      user.courses.push(course._id)
      course.students.push(user._id)
      await course.save()
      await user.save()
      return res.status(200).json({
        user: user,
        course: course,
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Error while subscribing' })
    }
  }

  async unsubscribe(req, res) {
    try {
      const { courseId } = req.query

      const course = await Course.findOneAndUpdate(
        { _id: courseId },
        { $pull: { students: req.user.id } },
        { new: true },
      )

      const user = await User.findOneAndUpdate(
        { _id: req.user.id },
        { $pull: { courses: courseId } },
        { new: true },
      )

      return res.status(200).json({
        user: user,
        course: course,
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Can not unsubscribe course' })
    }
  }

  async toggleReady(req, res) {
    try {
      const { id } = req.params
      const course = await Course.findOne({ _id: id }).populate('lessons')
      course.isReady = !course.isReady
      await course.save()
      return res.status(200).json({
        course,
      })
    } catch (error) {
      consola.error(error)
      return res.status(500).json({ message: 'Error while toggle ready course' })
    }
  }

  async getMarks(req, res) {
    try {
      const { id } = req.params
      const course = await Course.findOne({ _id: id })
        .populate({ path: 'lessons' })

      return res.status(200).json({
        course,
      })
    } catch (error) {
      consola.error(error)
      return res.status(500).json({ message: 'Error while loading marks' })
    }
  }

  async delete(req, res) {
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
