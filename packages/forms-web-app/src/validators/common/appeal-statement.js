const { checkSchema } = require('express-validator');
const fileUploadSchema = require('./schemas/file-upload');
const {
	rule: doesNotIncludeSensitiveInformationRule
} = require('./does-not-include-sensitive-information');

const defaultSensitiveInfoError =
	'Select to confirm that you have not included any sensitive information in your appeal statement';

const rules = (noFilesError, sensitiveInfoError = defaultSensitiveInfoError) => {
	return [
		checkSchema(fileUploadSchema(noFilesError)),
		doesNotIncludeSensitiveInformationRule(sensitiveInfoError)
	];
};

module.exports = {
	rules
};
