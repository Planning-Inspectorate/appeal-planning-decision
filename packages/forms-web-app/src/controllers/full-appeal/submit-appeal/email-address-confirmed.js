const {
	VIEW: {
		FULL_APPEAL: { EMAIL_CONFIRMED, LIST_OF_DOCUMENTS }
	}
} = require('../../../lib/full-appeal/views');
const { getDepartmentFromId } = require('../../../services/department.service');
const { getLPAById } = require('../../../lib/appeals-api-wrapper');
const { FLAG } = require('@pins/common/src/feature-flags');
const { isFeatureActive } = require('../../../featureFlag');

const getEmailConfirmed = async (req, res) => {
	const appeal = req.session.appeal;

	const lpa = await getDepartmentFromId(appeal.lpaCode);
	const lpaCode = lpa.lpaCode ?? (await getLPAById(lpa.id)).lpaCode; // fallback to lookup in case cached lpa doesn't have code

	const usingV2Form = await isFeatureActive(FLAG.S78_APPEAL_FORM_V2, lpaCode);

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
