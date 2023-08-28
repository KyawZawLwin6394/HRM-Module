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
  relatedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users'
  },
  relatedDepartment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Departments'
  },
  totalAttendance: {
    type: Number
  },
  paidLeaves: {
    type: Number
  },
  unpaidLeaves: {
    type: Number
  },
  entitledSalary: {
    type: Number
  }
})

module.exports = mongoose.model('Payroll', PayrollSchema)
