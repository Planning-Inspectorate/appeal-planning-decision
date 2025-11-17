const {
	VIEW: {
		APPELLANT_SUBMISSION: { CANNOT_APPEAL }
	}
} = require('../../lib/views');

const getCannotAppealEnforcement = (_, res) => {
	const beforeYouStartFirstPage = '/before-you-start';

	res.render(CANNOT_APPEAL, {
		beforeYouStartFirstPage,
		isEnforcement: true
	});
};

module.exports = {
	getCannotAppealEnforcement
};
