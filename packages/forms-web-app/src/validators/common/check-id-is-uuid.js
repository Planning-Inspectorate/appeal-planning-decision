const { check } = require('express-validator');

const rules = () => [check('id').isUUID(4).withMessage(`Appeal ID is not in a valid format`)];

module.exports = {
	rules
};
