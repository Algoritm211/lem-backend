const { model, Schema, ObjectId } = require('mongoose')

const Code = new Schema({
  lesson: { type: ObjectId, ref: 'Lesson' },
  body: { type: String, default: '' },
  language: { type: String, default: 'nodejs' },
  answer: { type: String, default: '' },
  score: { type: Number, default: 1 },
  tests: [{ test: String, expected: String }],
  type: { type: String, default: 'code' },
})

module.exports = model('Code', Code)
