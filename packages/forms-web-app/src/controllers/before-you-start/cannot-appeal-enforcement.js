const {
	VIEW: {
		BEFORE_YOU_START: { CANNOT_APPEAL_ENFORCEMENT: cannotAppealEnforcement }
	}
} = require('../../lib/views');

exports.getCannotAppealEnforcement = async (_, res) => {
	const beforeYouStartFirstPage = '/before-you-start/local-planning-authority';

	res.render(cannotAppealEnforcement, {
		beforeYouStartFirstPage
	});
};
