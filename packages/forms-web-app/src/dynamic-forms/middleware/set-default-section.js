const config = require('../../config');

module.exports = () => (req, res, next) => {
	if (!req.params.section) {
		req.params.section = config.dynamicForms.DEFAULT_SECTION;
	}
	next();
};
