const { VIEW } = require('../../lib/views');

exports.getAccessibilityStatement = async (req, res) => {
	let layoutTemplate = 'layouts/full-appeal-banner/main.njk';

	if (req.session?.user?.isLpaUser) {
		layoutTemplate = 'layouts/lpa-dashboard/main.njk';
	}

	res.render(VIEW.ACCESSIBILITY_STATEMENT, {
		layoutTemplate
	});
};
