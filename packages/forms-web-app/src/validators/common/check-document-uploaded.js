const { checkSchema } = require('express-validator');
const checkDocumentUploadedSchema = require('./schemas/check-document-uploaded-schema');

const rules = (path, documentType, submissionType) => [
	checkSchema(checkDocumentUploadedSchema(path, documentType, submissionType))
];

module.exports = {
	rules
};
