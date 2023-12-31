const multer = require("multer");
const path = require("path");
const fs = require("fs");
const config = require('../../config/db');
const uri = config.uploadsURI;

function getRandomText() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    for (var i = 0; i < 3; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === "edu") {
            cb(null, './uploads/hrm/employee/edu');
        } else if (file.fieldname === "cv") {
            cb(null, './uploads/hrm/employee/cv');
        } else if (file.fieldname === "other") {
            cb(null, './uploads/hrm/employee/other');
        } else if (file.fieldname === "recLet") {
            cb(null, './uploads/hrm/employee/recLet');
        }
        else if (file.fieldname === "pf") {
            cb(null, './uploads/hrm/employee/pf');
        }

    },
    filename: function (req, file, cb) {
        let name = file.originalname.split(".")[0];
        let ext = file.originalname.split(".")[1];
        const randomText = getRandomText();
        if (file.fieldname === "edu") {
            cb(null, "EDU-" + name + randomText + Date.now() + "." + ext)
        } else if (file.fieldname === "cv") {
            cb(null, "CV-" + name + randomText + Date.now() + "." + ext)
        } else if (file.fieldname === "other") {
            cb(null, "OTH-" + name + randomText + Date.now() + "." + ext)
        } else if (file.fieldname === "recLet") {
            cb(null, "RL-" + name + randomText + Date.now() + "." + ext)
        } else if (file.fieldname === "pf") {
            cb(null, "PF-" + name + randomText + Date.now() + "." + ext)
        }


    },
});

exports.upload = multer({
    fileFilter: function (req, file, cb) {
        for (let i = 0; i < uri.length; i++) {
            if (!fs.existsSync(uri[i])) {
                fs.mkdirSync(uri[i], { recursive: true });
            }
        }
        let filetypes = /jpeg|jpg|png|pdf|docx/;
        let mimetype = filetypes.test(file.mimetype);
        const randomText = getRandomText();
        let extname = filetypes.test(
            path
                .extname(file.originalname + randomText + Date.now())
                .toLowerCase()
        );
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(
            "Error: File upload only supports the following filetypes - " +
            filetypes
        );
    },
    storage: storage,
}).fields(
    [
        {
            name: 'edu',
            maxCount: 5
        },
        {
            name: 'cv',
            maxCount: 2
        },
        {
            name: 'other',
            maxCount: 5
        },
        {
            name: 'recLet',
            maxCount: 1
        },
        {
            name: 'pf',
            maxCount: 1
        },
    ]
);
