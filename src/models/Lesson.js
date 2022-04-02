const { model, Schema, ObjectId } = require('mongoose')
const { stepTypes } = require('./enums')

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
      enum: stepTypes,
    },
  }],
  students: [{
    userId: {
      type: ObjectId,
      ref: 'User',
    },
    completedTests: [],
    mark: { type: Number, default: 0 },
  }],
  course: { type: ObjectId, ref: 'Course' },
})

module.exports = model('Lesson', Lesson)
