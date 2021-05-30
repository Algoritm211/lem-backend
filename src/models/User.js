const { Schema, model, ObjectId } = require('mongoose')

const User = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  fromGoogleAuth: { type: Boolean },
  avatar: {
    url: String,
    name: String,
  },
  city: { type: String },
  age: { type: Number, default: 0 },
  description: { type: String },
  surName: { type: String, default: '' },
  gender: { type: String },
  birthdayDate: { type: String, default: '' },
  dateRegistration: { type: Date, default: Date.now() },
  role: { type: String, default: 'student' },
  coursesAuthor: [{ type: ObjectId, ref: 'Course' }],
  courses: [{ type: ObjectId, ref: 'Course' }],
  likedCourses: [{ type: ObjectId, ref: 'Course' }],
  lessonsCompleted: [{ type: ObjectId, ref: 'Lesson' }],
  stepsCompleted: [{ type: ObjectId }],
})

module.exports = model('User', User)
