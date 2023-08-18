'use strict'

const attendance = require('../controllers/attendanceController')
const { catchError } = require('../lib/errorHandler')
const verifyToken = require('../lib/verifyToken')

module.exports = app => {
  app
    .route('/api/attendance')
    .post(verifyToken, catchError(attendance.createAttendance))
    .put(verifyToken, catchError(attendance.updateAttendance))

  app
    .route('/api/attendance/:id')
    .get(verifyToken, catchError(attendance.getAttendanceDetail))
    .delete(verifyToken, catchError(attendance.deleteAttendance))
    .post(verifyToken, catchError(attendance.activateAttendance))

  app
    .route('/api/attendances')
    .get(verifyToken, catchError(attendance.listAllAttendances))
}
