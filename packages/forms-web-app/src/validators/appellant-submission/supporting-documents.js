const { checkSchema } = require('express-validator');
const supportingDocumentsSchema = require('./supporting-documents-schema');

const rules = () => {
	return [checkSchema(supportingDocumentsSchema)];
};

module.exports = {
	rules
};
