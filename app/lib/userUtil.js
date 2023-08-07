const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const config = require('../../config/db');

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

module.exports = { bcryptHash, bcryptCompare, filterRequestAndResponse, sendEmail };
