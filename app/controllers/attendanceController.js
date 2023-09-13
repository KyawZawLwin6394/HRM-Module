'use strict'
const Attendance = require('../models/attendance');
const UserUtil = require('../lib/userUtil');
const path = require('path');
const Employee = require('../models/user')
const months = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

exports.createAttendance = async (req, res) => {
  let data = req.body
  try {
    let result = await Attendance.create(data)
    res.status(200).send({
      success: true,
      data: result
    })
  } catch (e) {
    console.log(e)
    return res.status(500).send({ error: true, message: e.message })
  }
}

exports.listAllAttendances = async (req, res) => {
  let { keyword, role, limit, skip, rowsPerPage, } = req.query
  let count = 0
  let page = 0
  try {
    limit = +limit <= 100 ? +limit : 10
    skip = +skip || 0
    let query = { isDeleted: false },
      regexKeyword
    role ? (query['role'] = role.toUpperCase()) : ''
    keyword && /\w/.test(keyword)
      ? (regexKeyword = new RegExp(keyword, 'i'))
      : ''
    regexKeyword ? (query['name'] = regexKeyword) : ''
    let result = await Attendance.find(query)
      .skip(skip)
      .limit(limit)
      .populate('relatedDepartment relatedUser')
    count = await Attendance.find(query).count()
    const division = count / (rowsPerPage || limit)
    page = Math.ceil(division)
    let unpaid = await Attendance.find(query).count()
    res.status(200).send({
      success: true,
      count: count,
      unpaidCount: unpaid,
      _metadata: {
        current_page: skip / limit + 1,
        per_page: limit,
        page_count: page,
        total_count: count
      },
      data: result
    })
  } catch (e) {
    return res.status(500).send({ error: true, message: e.message })
  }
}

exports.getAttendanceDetail = async (req, res) => {
  try {
    let result = await Attendance.find({ _id: req.params.id }).populate(
      'relatedDepartment relatedUser'
    )
    if (!result)
      return res.status(500).json({ error: true, message: 'No record found.' })
    res.json({ success: true, data: result })
  } catch (error) {
    return res.status(500).send({ error: true, message: error.message })
  }
}

exports.updateAttendance = async (req, res, next) => {
  let data = req.body
  try {
    let result = await Attendance.findOneAndUpdate(
      { _id: data.id },
      { $set: data },
      { new: true }
    ).populate('relatedDepartment relatedUser')
    return res.status(200).send({ success: true, data: result })
  } catch (error) {
    return res.status(500).send({ error: true, message: error.message })
  }
}

exports.deleteAttendance = async (req, res, next) => {
  try {
    const result = await Attendance.findOneAndUpdate(
      { _id: req.params.id },
      { isDeleted: true },
      { new: true }
    )
    return res
      .status(200)
      .send({ success: true, data: { isDeleted: result.isDeleted } })
  } catch (error) {
    return res.status(500).send({ error: true, message: error.message })
  }
}

exports.activateAttendance = async (req, res, next) => {
  try {
    const result = await Attendance.findOneAndUpdate(
      { _id: req.params.id },
      { isDeleted: false },
      { new: true }
    )
    return res
      .status(200)
      .send({ success: true, data: { isDeleted: result.isDeleted } })
  } catch (error) {
    return res.status(500).send({ error: true, message: error.message })
  }
}

exports.excelImport = async (req, res) => {
  try {
    const files = req.files
    if (!files.attendanceImport) return res.status(404).send({ error: true, message: 'File Not Found!' })
    console.log(files.attendanceImport)
    for (const i of files.attendanceImport) {
      const subpath = path.join('app', 'controllers');  // Construct the subpath using the platform's path separator
      const newPath = __dirname.replace(subpath, '');
      const dest = path.join(newPath, i.path)
      const data = await UserUtil.attendanceExcelImport(dest)
      await Attendance.insertMany(data).then((response) => {
        return res.status(200).send({
          success: true, data: response
        })
      })
        .catch(error => {
          return res.status(500).send({ error: true, message: error })
        })
    }
  } catch (error) {
    return res.status(500).send({ error: true, message: error.message })
  }
}

exports.attendanceDetail = async (req, res) => {
  let { keyword, role, limit, skip, rowsPerPage, emp, dep, month } = req.query
  let count = 0
  let page = 0
  try {
    limit = +limit <= 100 ? +limit : 10
    skip = +skip || 0
    let query = { isDeleted: false },
      regexKeyword
    role ? (query['role'] = role.toUpperCase()) : ''
    keyword && /\w/.test(keyword)
      ? (regexKeyword = new RegExp(keyword, 'i'))
      : ''
    regexKeyword ? (query['name'] = regexKeyword) : ''
    if (emp && dep) query = { ...query, relatedUser: emp, relatedDepartment: dep }
    if (month) {
      const result = await UserUtil.getDatesByMonth(month)
      query.date = result
    }
    let result = await Attendance.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ date: 1 })
      .populate('relatedDepartment relatedUser')
    count = await Attendance.find(query).count()
    const division = count / (rowsPerPage || limit)
    page = Math.ceil(division)

    res.status(200).send({
      success: true,
      count: count,
      _metadata: {
        current_page: skip / limit + 1,
        per_page: limit,
        page_count: page,
        total_count: count
      },
      data: result
    })
  } catch (e) {
    return res.status(500).send({ error: true, message: e.message })
  }
}

exports.mobileAttendanceLists = async (req, res) => {
  try {
    const { relatedEmployee } = req.query

    const response = []
    for (const month of months) {
      if (!months.includes(month)) return undefined;

      const monthIndex = months.indexOf(month);
      const startDate = new Date(Date.UTC(new Date().getFullYear(), monthIndex, 1));
      const endDate = new Date(Date.UTC(new Date().getFullYear(), monthIndex + 1, 0, 23, 59, 59, 999));
      const findAttendance = await Attendance.find({ date: { $gte: startDate.toISOString(), $lte: endDate.toISOString() }, relatedUser: relatedEmployee }).populate('relatedUser relatedDepartment')
      const totalAttendance = findAttendance.length
      const totalDays = new Date(endDate).getUTCDate();
      const attended = (totalAttendance * 100) / totalDays
      response.push({ month: month, attended: Math.round(attended), missed: Math.round(100 - attended), attendedDays: totalAttendance, missedDays: totalDays - totalAttendance })
    }
    return res.status(200).send({ success: true, data: response })
  } catch (error) {
    return res.status(500).send({ error: true, message: error.message })
  }

}

exports.mobileAttendanceDetail = async (req, res) => {
  const { month, relatedEmployee } = req.body;
  if (!months.includes(month)) return undefined;
  const monthIndex = months.indexOf(month);
  const startDate = new Date(Date.UTC(new Date().getFullYear(), monthIndex, 1));
  const endDate = new Date(Date.UTC(new Date().getFullYear(), monthIndex + 1, 0, 23, 59, 59, 999));
  const employeeResult = await Employee.find({ _id: relatedEmployee }).select('casualLeaves medicalLeaves vacationLeaves maternityLeaveMale maternityLeaveFemale')
  const attendanceResult = await Attendance.find({ date: { $gte: startDate.toISOString(), $lte: endDate.toISOString() }, relatedUser: relatedEmployee })
  return res.status(200).send({ success: true, employee: employeeResult[0], data: attendanceResult })
}