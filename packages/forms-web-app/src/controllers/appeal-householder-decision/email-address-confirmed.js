const { FLAG } = require('@pins/common/src/feature-flags');
const { isLpaInFeatureFlag } = require('#lib/is-lpa-in-feature-flag');
const { hideFromDashboard } = require('#lib/hide-from-dashboard');

const getEmailConfirmed = async (req, res) => {
	const appeal = req.session.appeal;

	const usingV2Form = await isLpaInFeatureFlag(appeal.lpaCode, FLAG.HAS_APPEAL_FORM_V2);

	let listOfDocumentsUrl = 'list-of-documents';

	if (usingV2Form) {
		await hideFromDashboard(req, appeal);
		listOfDocumentsUrl = '/appeals/householder/appeal-form/before-you-start';
	}

	res.render('appeal-householder-decision/email-address-confirmed', {
		listOfDocumentsUrl
	});
};

module.exports = {
	getEmailConfirmed
};
