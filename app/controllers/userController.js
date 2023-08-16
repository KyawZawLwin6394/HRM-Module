'use strict';
const User = require('../models/user');
const Attachment = require('../models/attachment')

exports.createUser = async (req, res) => {
  try {
    const data = req.body;
    const files = req.files;
    const attachments = [];
    const attachmentTypes = ['cv', 'edu', 'recLet', 'other', 'pf'];
    const attachmentMappings = {
      cv: 'CV',
      edu: 'educationCertificate',
      recLet: 'recommendationLetter',
      other: 'other',
      pf: 'profile'
    };

    for (const type of attachmentTypes) {
      if (files[type]) {
        const imgPath = files[type][0].path.split('hrm')[1];
        const attachData = {
          fileName: files[type][0].originalname,
          imgUrl: imgPath,
          image: imgPath.split('\\')[2],
          relatedEmployee: req.credentials.id
        };
        const newAttachment = new Attachment(attachData);
        const attachResult = await newAttachment.save();
        attachments.push({ type, id: attachResult._id.toString() });
      }
    }

    for (const attachment of attachments) {
      data[attachmentMappings[attachment.type]] = attachment.id;
    }

    const newUser = new User(data);
    const result = await newUser.save();

    res.status(200).send({
      success: true,
      data: result,
    });
  } catch (e) {
    return res.status(500).send({ error: true, message: e.message });
  }
};



exports.listAllUsers = async (req, res) => {
  let { keyword, role, limit, skip } = req.query;
  let count = 0;
  let page = 0;
  try {
    limit = +limit <= 100 ? +limit : 10;
    skip = +skip || 0;
    let query = { isDeleted: false },
      regexKeyword;
    role ? (query['role'] = role.toUpperCase()) : '';
    keyword && /\w/.test(keyword)
      ? (regexKeyword = new RegExp(keyword, 'i'))
      : '';
    regexKeyword ? (query['name'] = regexKeyword) : '';

    let result = await User.find(query).skip(skip).limit(limit).populate('profile educationCertificate CV other recommendationLetter relatedDepartment relatedPosition');
    count = await User.find(query).skip(skip).limit(limit).count();
    const division = count / limit;
    page = Math.ceil(division);

    res.status(200).send({
      success: true,
      count: count,
      _metadata: {
        current_page: skip / limit + 1,
        per_page: limit,
        page_count: page,
        total_count: count,
      },
      data: result,
    });
  } catch (e) {
    return res.status(500).send({ error: true, message: e.message });
  }
};

exports.getUserDetail = async (req, res) => {
  try {
    let result = await User.findById(req.params.id).populate('profile educationCertificate CV other recommendationLetter relatedDepartment relatedPosition');
    if (!result)
      return res.status(500).json({ error: true, message: 'No record found.' });
    res.json({ success: true, data: result });
  } catch (error) {
    return res.status(500).send({ error: true, message: error.message });
  }
};

exports.updateUser = async (req, res, next) => {
  let data = req.body;
  try {
    const attachments = [];
    const attachmentTypes = ['cv', 'edu', 'recLet', 'other', 'pf'];
    const attachmentMappings = {
      cv: 'CV',
      edu: 'educationCertificate',
      recLet: 'recommendationLetter',
      other: 'other',
      pf: 'profile'
    };

    for (const type of attachmentTypes) {
      if (files[type]) {
        const imgPath = files[type][0].path.split('hrm')[1];
        const attachData = {
          fileName: files[type][0].originalname,
          imgUrl: imgPath,
          image: imgPath.split('\\')[2],
          relatedEmployee: req.credentials.id
        };
        const newAttachment = new Attachment(attachData);
        const attachResult = await newAttachment.save();
        attachments.push({ type, id: attachResult._id.toString() });
      }
    }

    for (const attachment of attachments) {
      data[attachmentMappings[attachment.type]] = attachment.id;
    }
    let result = await User.findOneAndUpdate(data.id, data, {
      new: true,
    });
    return res.status(200).send({ success: true, data: result });
  } catch (error) {
    return res.status(500).send({ error: true, message: error.message });
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const result = await User.findOneAndUpdate(
      { _id: req.params.id },
      { isDeleted: true },
      { new: true }
    );
    return res
      .status(200)
      .send({ success: true, data: { isDeleted: result.isDeleted } });
  } catch (error) {
    return res.status(500).send({ error: true, message: error.message });
  }
};

exports.activateUser = async (req, res, next) => {
  try {
    const result = await User.findOneAndUpdate(
      { _id: req.params.id },
      { isDeleted: false },
      { new: true }
    );
    return res
      .status(200)
      .send({ success: true, data: { isDeleted: result.isDeleted } });
  } catch (error) {
    return res.status(500).send({ error: true, message: error.message });
  }
};
