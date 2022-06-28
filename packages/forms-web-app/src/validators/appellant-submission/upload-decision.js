const { checkSchema } = require('express-validator');
const uploadDecisionSchema = require('./upload-decision-schema');

const rules = () => {
	return [checkSchema(uploadDecisionSchema)];
};

module.exports = {
	rules
};
