const { checkSchema } = require('express-validator');
const fileUploadSchema = require('./schemas/file-upload');
const {
	rule: doesNotIncludeSensitiveInformationRule
} = require('./does-not-include-sensitive-information');

const rules = (noFilesError) => {
	return [
		checkSchema(fileUploadSchema(noFilesError)),
		doesNotIncludeSensitiveInformationRule(
			'Select to confirm that you have not included any sensitive information in your appeal statement'
		)
	];
};

module.exports = {
	rules
};
