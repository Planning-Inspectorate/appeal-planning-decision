const { FLAG } = require('@pins/common/src/feature-flags');
const { isLpaInFeatureFlag } = require('#lib/is-lpa-in-feature-flag');

const getEmailConfirmed = async (req, res) => {
	const appeal = req.session.appeal;

	const usingV2Form = await isLpaInFeatureFlag(appeal.lpaCode, FLAG.HAS_APPEAL_FORM_V2);

	const listOfDocumentsUrl = usingV2Form
		? '/appeals/householder/appeal-form/before-you-start'
		: 'list-of-documents';
	res.render('appeal-householder-decision/email-address-confirmed', {
		listOfDocumentsUrl
	});
};

module.exports = {
	getEmailConfirmed
};
