const { model, Schema, ObjectId } = require('mongoose')

// All types of subjects:
// const subjectTypes = ['math', 'it', 'chemistry', 'physics', 'biology', 'history']

const Course = new Schema({
  title: { type: String },
  description: { type: String }, // short description
  about: { type: String }, // long description
  category: { type: String },
  rating: { type: Number },
  subject: { type: String },
  coursePreview: {
    url: String,
    name: String,
  },
  isReady: { type: Boolean },
  author: { type: ObjectId, ref: 'User' },
  lessons: [{ type: ObjectId, ref: 'Lesson' }],
  students: [{ type: ObjectId, ref: 'User' }],
})

module.exports = model('Course', Course)
