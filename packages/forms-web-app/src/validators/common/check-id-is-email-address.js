const { param } = require('express-validator');

const rules = () => [param('id').isEmail(4).withMessage(`User ID is not in a valid format`)];

module.exports = {
	rules
};
