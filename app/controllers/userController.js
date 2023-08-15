'use strict';
const User = require('../models/user');
const Attachment = require('../models/attachment')

exports.createUser = async (req, res) => {
  let data = req.body;
  let files = req.files
  try {
    if (files.cv) {
      let imgPath = files.cv[0].path.split('hrm')[1];
      const attachData = {
        fileName: files.cv[0].originalname,
        imgUrl: imgPath,
        image: imgPath.split('\\')[2],
        relatedEmployee: req.credentials.id
      };
      const newAttachment = new Attachment(attachData);
      const attachResult = await newAttachment.save();
      data = { ...data, CV: attachResult._id.toString() };
    }

    if (files.edu) {
      let imgPath = files.edu[0].path.split('hrm')[1];
      const attachData = {
        fileName: files.edu[0].originalname,
        imgUrl: imgPath,
        image: imgPath.split('\\')[2],
        relatedEmployee: req.credentials.id
      };
      const newAttachment = new Attachment(attachData);
      const attachResult = await newAttachment.save();
      data = { ...data, educationCertificate: attachResult._id.toString() };
    }

    if (files.recLet) {
      let imgPath = files.recLet[0].path.split('hrm')[1];
      const attachData = {
        fileName: files.recLet[0].originalname,
        imgUrl: imgPath,
        image: imgPath.split('\\')[2],
        relatedEmployee: req.credentials.id
      };
      const newAttachment = new Attachment(attachData);
      const attachResult = await newAttachment.save();
      data = { ...data, recommendationLetter: attachResult._id.toString() };
    }

    if (files.recLet) {
      let imgPath = files.recLet[0].path.split('hrm')[1];
      const attachData = {
        fileName: files.recLet[0].originalname,
        imgUrl: imgPath,
        image: imgPath.split('\\')[2],
        relatedEmployee: req.credentials.id
      };
      const newAttachment = new Attachment(attachData);
      const attachResult = await newAttachment.save();
      data = { ...data, recommendationLetter: attachResult._id.toString() };
    }

    if (files.other) {
      let imgPath = files.other[0].path.split('hrm')[1];
      const attachData = {
        fileName: files.other[0].originalname,
        imgUrl: imgPath,
        image: imgPath.split('\\')[2],
        relatedEmployee: req.credentials.id
      };
      const newAttachment = new Attachment(attachData);
      const attachResult = await newAttachment.save();
      data = { ...data, other: attachResult._id.toString() };
    }
    const newUser = new User(data);
    let result = await newUser.save();
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

    let result = await User.find(query).skip(skip).limit(limit);
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
    let result = await User.findById(req.params.id);
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

    const { password, ...preparation } = data //removes password field from data
    let result = await User.findByIdAndUpdate(req.body.id, { $set: preparation }, {
      new: true,
    });
    return res.status(200).send({ success: true, data: result });
  } catch (error) {
    if (error.code === 11000)
      return res
        .status(500)
        .send({ error: true, message: 'This email is already registered!' });
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
