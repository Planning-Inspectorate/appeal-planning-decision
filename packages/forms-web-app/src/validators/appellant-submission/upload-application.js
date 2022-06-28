const { checkSchema } = require('express-validator');
const uploadApplicationSchema = require('./upload-application-schema');

const rules = () => {
	return [checkSchema(uploadApplicationSchema)];
};

module.exports = {
	rules
};
