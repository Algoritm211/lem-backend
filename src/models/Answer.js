const { model, Schema, ObjectId } = require('mongoose')
const { stepTypes } = require('./enums')

const Answer = new Schema({
  text: { type: String },
  score: { type: Number },

  step: { type: ObjectId, required: true, refPath: 'stepType' },
  stepType: { type: String, required: true, enum: stepTypes },
  user: { type: ObjectId, required: true, ref: 'User' },
})


module.exports = model('Answer', Answer)
