'use strict'

const mongoose = require('mongoose')
mongoose.promise = global.Promise
const Schema = mongoose.Schema

let PayrollSchema = new Schema({
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
  relatedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users'
  },
  type: {
    type: String,
    enum: ['Attend', 'Dismiss']
  },
  source: {
    type: String,
    enum: ['Excel', 'Manual']
  },
  clockIn: {
    type: String
  },
  clockOut: {
    type: String
  },
  relatedDepartment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Departments'
  }
})

module.exports = mongoose.model('Payroll', PayrollSchema)
