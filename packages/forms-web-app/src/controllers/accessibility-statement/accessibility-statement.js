const { VIEW } = require('../../lib/views');

exports.getAccessibilityStatement = async (_, res) => {
	res.render(VIEW.ACCESSIBILITY_STATEMENT);
};
