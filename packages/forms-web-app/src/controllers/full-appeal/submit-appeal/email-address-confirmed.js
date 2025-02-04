const {
	VIEW: {
		FULL_APPEAL: { EMAIL_CONFIRMED, LIST_OF_DOCUMENTS }
	}
} = require('../../../lib/full-appeal/views');
const { FLAG } = require('@pins/common/src/feature-flags');
const { isLpaInFeatureFlag } = require('#lib/is-lpa-in-feature-flag');

const getEmailConfirmed = async (req, res) => {
	const appeal = req.session.appeal;

	const usingV2Form = await isLpaInFeatureFlag(appeal.lpaCode, FLAG.S78_APPEAL_FORM_V2);

	const listOfDocumentsUrl = usingV2Form
		? '/appeals/full-planning/appeal-form/before-you-start'
		: `/${LIST_OF_DOCUMENTS}`;

	res.render(EMAIL_CONFIRMED, {
		listOfDocumentsUrl
	});
};

module.exports = {
	getEmailConfirmed
};
