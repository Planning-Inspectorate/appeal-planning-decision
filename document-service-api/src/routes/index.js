/**
 * Routes
 *
 * This puts all the endpoints into the application.
 */

const {
    DocumentWriter, 
    DocumentReader 
} = require('../controllers');
const { 
    Router 
} = require('express');
const multerStrategy = require('../lib/multerStrategy')
const routes = Router();

// TO-DO: document in Swagger
// TO-DO: security (use .array instead of .any) 
// validate file type (one of .pdf, .jpg ...)
routes
    .post(
        '/',
        multerStrategy.any(),
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
