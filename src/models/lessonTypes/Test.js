const { model, Schema, ObjectId } = require('mongoose')

const Test = new Schema({
  question: { type: String, required: true },
  options: [{ type: String }],
  answers: [{ type: String }],
  userAnswers: [{ type: String }],
  type: { type: String, enum: ['single', 'multiple'] },
  score: { type: Number, default: 1 },
  lesson: { type: ObjectId, ref: 'Lesson' },
})

module.exports = model('Test', Test)
