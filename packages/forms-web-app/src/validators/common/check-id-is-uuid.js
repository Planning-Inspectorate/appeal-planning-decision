const { check } = require('express-validator');

/**
 * @param {string} paramName -  the param to check is a uuid
 */
const rules = (paramName) => [
	check(paramName).isUUID(4).withMessage(`${paramName} is not in a valid format`)
];

module.exports = {
	rules
};
