const { model, Schema, ObjectId } = require('mongoose')

const TextWithAnswer = new Schema({
  lesson: { type: ObjectId, ref: 'Lesson' },
  body: { type: String },
  answer: { type: String, default: '' },
  type: { type: String, default: 'textWithAnswer' },
})

module.exports = model('TextWithAnswer', TextWithAnswer)
