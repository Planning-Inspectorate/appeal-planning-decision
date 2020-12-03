/**
 * Routes
 *
 * This puts all the endpoints into the application.
 */

const {
    documentStorage: {
        documentStorage: {
            directory
        }
    }
} = require('../lib/config');
const { 
    DocumentWriter, 
    DocumentReader 
} = require('../controllers')
const { 
    Router 
} = require('express');
const uuid = require('uuid');
const multer = require('multer');
const mime = require('mime-types')

const routes = Router();
const strategy = multer.diskStorage({
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

// TO-DO: document in Swagger
// TO-DO: security (use .array instead of .any) 
// validate file type (one of .pdf, .jpg ...)
routes
    .post(
        '/',
        strategy.any(),
        DocumentWriter
    );

// TO-DO: document in Swagger
// TO-DO: security
routes
    .get(
        '/:id',
        DocumentReader
    );

module.exports = routes;
