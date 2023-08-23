const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const config = require('../../config/db');
const Excel = require('exceljs');
const User = require('../models/user');
const workbook = new Excel.Workbook();

async function attendanceExcelImport(filePath) {
  await workbook.xlsx.readFile(filePath);
  const worksheet = workbook.getWorksheet(1);
  const data = [];

  const rows = worksheet.getRows(2, worksheet.actualRowCount);
  for (const row of rows) {
    if (row.getCell(2).value, 'here') {
      let treatmentName = row.getCell(7).value;
      try {
        const employeeName = row.getCell(4).value
        const filtered = employeeName ? employeeName.split(' (KWD)')[0] : ''
        const relatedUser = await User.findOne({ givenName: filtered });
        console.log(relatedUser, filtered)
        if (relatedUser) {
          console.log(relatedUser)
          const rowData = {
            relatedUser: relatedUser?._id,
            clockIn: row.getCell(10).value,
            clockOut: row.getCell(11).value,
            date:row.getCell(6).value,
            type: 'Attend',
            source: 'Excel',
            relatedDepartment: relatedUser.relatedDepartment
          };
          data.push(rowData);
        }
      } catch (error) {
        console.error("Error processing row:", error);
      }
    }
  }

  return data;
}

// Create a transporter using your Gmail account credentials
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.senderEmail, // Replace with your Gmail email address
    pass: config.senderPassword // Replace with your Gmail password or an app-specific password if you have enabled 2-step verification
  }
});

// Send the email
async function sendEmail(mailOptions) {
  const result = transporter.sendMail(mailOptions);
  return result
}

async function filterRequestAndResponse(reArr, reBody) {
  if (reArr.length > 0) {
    const result = {};
    reArr.map((req) => {
      result[req] = reBody[req];
    })
    return result;
  }
  return;
}

async function bcryptHash(password) {
  const hashedPassword = await bcrypt.hash(password, 10)
  return hashedPassword
}

async function bcryptCompare(plain, hash) {
  const result = await bcrypt.compare(plain, hash)
  return result
}

module.exports = { bcryptHash, bcryptCompare, filterRequestAndResponse, sendEmail, attendanceExcelImport };
