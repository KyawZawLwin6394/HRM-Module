'use strict'

const mongoose = require('mongoose')
mongoose.promise = global.Promise
const Schema = mongoose.Schema

let AttendanceSchema = new Schema({
  createdAt: {
    type: Date,
    default: Date.now
  },

  isDeleted: {
    type: Boolean,
    default: false
  },
  date: {
    type: Date
  },
  time: {
    type: String
  },
  name: {
    type: String
  },
  type: {
    type: String,
    enum: ['Attend', 'Dismiss']
  },
  source: {
    type: String,
    enum: ['Excel', 'Manual']
  },
  relatedDepartment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Departments'
  }
})

module.exports = mongoose.model('Attendance', AttendanceSchema)
