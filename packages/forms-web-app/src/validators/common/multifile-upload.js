const { checkSchema } = require('express-validator');
const multifileUploadSchema = require('./schemas/multifile-upload-schema');

const rules = (path) => [checkSchema(multifileUploadSchema(path))];

module.exports = {
	rules
};
