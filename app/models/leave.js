'use strict'

const mongoose = require('mongoose')
mongoose.promise = global.Promise
const Schema = mongoose.Schema

let LeaveSchema = new Schema({
    createdAt: {
        type: Date,
        default: Date.now
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    relatedUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    relatedPosition: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Positions'
    },
    relatedDepartment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Departments'
    },
    reason: {
        type: String,
    },
    leaveType: {
        type: String,
        enum: ['Casual', 'Medical', 'Vacation', 'Maternity']
    },
    status: {
        type: String,
        enum: ['Approved', 'Declined','Unset']
    },
    attach: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Attachments'
    }],
    isPaid: {
        type: Boolean
    },
    remark: {
        type: String
    },
    leaveAllowed: {
        type: Number
    },
    leaveToken: {
        type: String
    },
    seq: {
        type: Number
    }
})

module.exports = mongoose.model('Leave', LeaveSchema)
