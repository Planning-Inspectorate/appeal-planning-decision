const { checkSchema } = require('express-validator');
const checkDocumentUploadedSchema = require('./schemas/check-document-uploaded-schema');

const rules = (path, documentType, submissionType, errorMsg) => [
	checkSchema(checkDocumentUploadedSchema(path, documentType, submissionType, errorMsg))
];

module.exports = {
	rules
};
