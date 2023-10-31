const multer = require("multer");

exports.singleFileUpload = multer({
    storage:storage
})