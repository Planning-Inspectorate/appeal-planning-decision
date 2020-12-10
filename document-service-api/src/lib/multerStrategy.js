const {
    documentStorage: {
        documentStorage: {
            directory,
            maxFileSizeInBytes
        }
    }
} = require('./config');
const multer = require('multer');
const uuid = require('uuid');
const mime = require('mime-types');
const storage = multer.diskStorage({
    destination: (
        req,
        file,
        next
    ) => next(
        null,
        directory
    ),
    filename: (
        req,
        file,
        next
    ) => next(
        null,
        `${uuid.v4()}.${mime.extension(file.mimetype)}`
    )
});
const strategy = multer({
    storage,
    limits: {
        fileSize: maxFileSizeInBytes
    }
})

module.exports = strategy