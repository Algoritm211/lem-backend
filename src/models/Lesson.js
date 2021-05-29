const { model, Schema, ObjectId } = require('mongoose')

const Lesson = new Schema({
  title: { type: String },
  steps: [{
    stepId: {
      type: ObjectId,
      required: true,
      refPath: 'steps.stepModel',
    },
    stepModel: {
      type: String,
      required: true,
      enum: ['Text', 'Video', 'TextWithAnswer'],
    },
  }],
  course: { type: ObjectId, ref: 'Course' },
})

module.exports = model('Lesson', Lesson)
