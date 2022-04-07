const { model, Schema, ObjectId } = require('mongoose')

const Code = new Schema({
  lesson: { type: ObjectId, ref: 'Lesson' },
  body: { type: String },
  score: { type: Number, default: 1 },
  type: { type: String, default: 'code' },
})

module.exports = model('Code', Code)
