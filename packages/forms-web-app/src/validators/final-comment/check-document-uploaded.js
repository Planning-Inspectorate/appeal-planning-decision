//todo: test

const { checkSchema } = require('express-validator');
const checkDocumentUploadedSchema = require('./check-document-uploaded-schema');

const rules = (path) => [checkSchema(checkDocumentUploadedSchema(path))];

module.exports = {
	rules
};
