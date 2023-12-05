const { VIEW } = require('../../lib/views');

exports.get = async (_, res) => {
	res.render(VIEW.APPEAL.EMAIL_ADDRESS);
};
