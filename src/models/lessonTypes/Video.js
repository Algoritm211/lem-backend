const { model, Schema, ObjectId } = require('mongoose')

const Video = new Schema({
  lesson: { type: ObjectId, ref: 'Lesson' },
  url: { type: String },
  type: { type: String, default: 'video' },
})

module.exports = model('Video', Video)
