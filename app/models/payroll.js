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
  // maPerDay: {
  //   type: Number,
  //   default: 0
  // },
  // maTotalDays: {
  //   type: Number,
  //   default: 0
  // },
  // maTotalAmount: {
  //   type: Number,
  //   default: 0
  // },
  // travelPerDay: {
  //   type: Number,
  //   default: 0
  // },
  // travelTotalDays: {
  //   type: Number,
  //   default: 0
  // },
  // travelTotalAmount: {
  //   type: Number,
  //   default: 0
  // },
  otPerDay: {
    type: Number,
    default: 0
  },
  otTotalDays: {
    type: Number,
    default: 0
  },
  otTotalAmount: {
    type: Number,
    default: 0
  },
  // AReason : {
  //   type: String
  // },
  // AAmount : {
  //   type: Number,
  //   default: 0
  // },
  // BReason : {
  //   type: String
  // },
  // BAmount : {
  //   type: Number,
  //   default: 0
  // },
  // CReason : {
  //   type: String
  // },
  // CAmount : {
  //   type: Number,
  //   default: 0
  // },
  // perReason : {
  //   type: String
  // },
  // perAmount : {
  //   type: Number,
  //   default: 0
  // },
  // positionReason : {
  //   type: String
  // },
  // positionAmount : {
  //   type: Number,
  //   default: 0
  // },
  // technicalReason : {
  //   type: String
  // },
  // technicalAmount : {
  //   type: Number,
  //   default: 0
  // },
  // partiReason : {
  //   type: String
  // },
  // partiAmount : {
  //   type: Number,
  //   default: 0
  // },
  // tranReason : {
  //   type: String
  // },
  // tranAmount : {
  //   type: Number,
  //   default: 0
  // },
  // attendReason : {
  //   type: String
  // },
  // attendAmount : {
  //   type: Number,
  //   default: 0
  // },
  // governmentReason : {
  //   type: String
  // },
  // governmentAmount : {
  //   type: Number,
  //   default: 0
  // },
  reductionReason : {
    type: String
  },
  reductionAmount : {
    type: Number,
    default: 0
  },
  // incentiveReason: {
  //   type: String
  // },
  // incentiveAmount: {
  //   type: Number,
  //   default: 0
  // },
  temporaryBonusReason: {
    type: String
  },
  temporaryonusAmount: {
    type: Number,
    default: 0
  },
  
  incomeTaxPercent: {
    type: String
  },
  incomeTaxAmount: {
    type: Number,
    default: 0
  },
  subTotal: {
    type: Number,
    default: 0
  },
  netSalary: {
    type: Number,
    default: 0
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
    type: Number,
    default : 0
  },
  paidDays: {
    type: Number,
    default: 0
  },
  unpaidDays: {
    type: Number,
    default: 0
  },
  attendedSalary: {
    type: Number,
    default: 0
  },
  dismissedSalary: {
    type: Number,
    default: 0
  },
  month: {
    type: String,
    enum: ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  },
  isExtra: {
    type: Boolean,
    default: false
  }
})

module.exports = mongoose.model('Payroll', PayrollSchema)
