const { VIEW } = require('../../lib/views');

/**
 * @type {import('express').RequestHandler}
 */
exports.get = (req, res) => {
	res.render(VIEW.APPEALS.NO_APPEALS, {
		startNewUrl: `/${VIEW.APPEAL.START_NEW}`,
		emailUrl: `/${VIEW.APPEAL.EMAIL_ADDRESS}`
	});
};
