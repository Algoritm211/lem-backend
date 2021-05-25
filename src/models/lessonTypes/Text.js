const { model, Schema, ObjectId } = require('mongoose')

const Text = new Schema({
  lesson: { type: ObjectId, ref: 'Lesson' },
  body: { type: String },
  type: { type: String, default: 'text' },
})

module.exports = model('Text', Text)
