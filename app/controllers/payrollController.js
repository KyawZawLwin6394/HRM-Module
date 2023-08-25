'use strict'
const Payroll = require('../models/payroll')

exports.createPayroll = async (req, res) => {
  let data = req.body
  try {
    let result = await Payroll.create(data)
    res.status(200).send({
      success: true,
      data: result
    })
  } catch (e) {
    console.log(e)
    return res.status(500).send({ error: true, message: e.message })
  }
}