'use strict';
const Leave = require('../models/leave');
const Attachment = require('../models/attachment');

exports.createLeave = async (req, res) => {
    let data = req.body;
    let files = req.files;
    let attachmentIDS = [];
    try {
        if (files['attach']) {
            console.log('here')
            for (const item of files.attach) {
                let imgPath = item.path.split('hrm')[1];
                const attachData = {
                    fileName: item.originalname,
                    imgUrl: imgPath,
                    image: imgPath.split('\\')[2]
                };
                const newAttachment = new Attachment(attachData);
                const attachResult = await newAttachment.save();
                attachmentIDS.push(attachResult._id.toString())
            }
            data = { ...data, attach: attachmentIDS };
        }

        console.log(data, 'data')
        let result = await Leave.create(data);
        res.status(200).send({
            success: true,
            data: result,
        });
    } catch (e) {
        console.log(e)
        return res.status(500).send({ error: true, message: e.message });
    }
};

exports.listAllLeaves = async (req, res) => {
    let { keyword, role, limit, skip, rowsPerPage } = req.query;
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

        let result = await Leave.find(query).skip(skip).limit(limit).populate('relatedUser relatedPosition attach');
        count = await Leave.find(query).count();
        const division = count / (rowsPerPage || limit);
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

exports.getLeaveDetail = async (req, res) => {
    try {
        let result = await Leave.find({ _id: req.params.id }).populate('relatedUser relatedPosition attach');
        if (!result)
            return res.status(500).json({ error: true, message: 'No record found.' });
        res.json({ success: true, data: result });
    } catch (error) {
        return res.status(500).send({ error: true, message: error.message });
    }
};

exports.updateLeave = async (req, res, next) => {
    let data = req.body;
    let files = req.files;
    let attachmentIDS = [];
    try {
        if (files.attach) {
            for (const item of files.attach) {
                let imgPath = item.path.split('hrm')[1];
                const attachData = {
                    fileName: item.originalname,
                    imgUrl: imgPath,
                    image: imgPath.split('\\')[2]
                };
                const newAttachment = new Attachment(attachData);
                const attachResult = await newAttachment.save();
                attachmentIDS.push(attachResult._id.toString())
            }
            data = { ...data, attach: attachmentIDS };
        }

        console.log(data, 'data')
        let result = await Leave.findOneAndUpdate({ _id: data.id }, { $set: data }, { new: true }).populate('relatedUser relatedPosition attach');
        return res.status(200).send({ success: true, data: result });
    } catch (error) {
        return res.status(500).send({ error: true, message: error.message });
    }
};

exports.deleteLeave = async (req, res, next) => {
    try {
        const result = await Leave.findOneAndUpdate(
            { _id: req.params.id },
            { isDeleted: true },
            { new: true }
        );
        return res.status(200).send({ success: true, data: { isDeleted: result.isDeleted } });
    } catch (error) {
        return res.status(500).send({ error: true, message: error.message });
    }
};

exports.activateLeave = async (req, res, next) => {
    try {
        const result = await Leave.findOneAndUpdate(
            { _id: req.params.id },
            { isDeleted: false },
            { new: true }
        );
        return res.status(200).send({ success: true, data: { isDeleted: result.isDeleted } });
    } catch (error) {
        return res.status(500).send({ error: true, message: error.message });
    }
};
