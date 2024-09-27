const { getDepartmentFromId } = require('../../services/department.service');
const { getLPAById } = require('../../lib/appeals-api-wrapper');
const { FLAG } = require('@pins/common/src/feature-flags');
const { isFeatureActive } = require('../../featureFlag');

const getEmailConfirmed = async (req, res) => {
	const appeal = req.session.appeal;

	console.log('eeekkkeeekkk');
	console.log(appeal);

	const lpa = await getDepartmentFromId(appeal.lpaCode);
	const lpaCode = lpa.lpaCode ?? (await getLPAById(lpa.id)).lpaCode; // fallback to lookup in case cached lpa doesn't have code

	const usingV2Form = await isFeatureActive(FLAG.HAS_APPEAL_FORM_V2, lpaCode);

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
