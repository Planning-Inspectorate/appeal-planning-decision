const {
	constants: {
		TYPE_OF_PLANNING_APPLICATION: {
			HOUSEHOLDER_PLANNING,
			LISTED_BUILDING,
			MINOR_COMMERCIAL_DEVELOPMENT,
			LAWFUL_DEVELOPMENT_CERTIFICATE,
			ADVERTISEMENT,
			I_HAVE_NOT_MADE_A_PLANNING_APPLICATION,
			PRIOR_APPROVAL,
			REMOVAL_OR_VARIATION_OF_CONDITIONS,
			SOMETHING_ELSE
		}
	}
} = require('@pins/business-rules');
const logger = require('../../lib/logger');
const { createOrUpdateAppeal } = require('../../lib/appeals-api-wrapper');
const {
	VIEW: {
		FULL_APPEAL: { TYPE_OF_PLANNING_APPLICATION }
	}
} = require('../../lib/views');
const { mapPlanningApplication } = require('../../lib/full-appeal/map-planning-application');
const { FLAG } = require('@pins/common/src/feature-flags');
const { isLpaInFeatureFlag } = require('#lib/is-lpa-in-feature-flag');
const {
	typeOfPlanningApplicationRadioItems
} = require('#lib/type-of-planning-application-radio-items');

const getTypeOfPlanningApplication = async (req, res) => {
	const { appeal } = req.session;

	const [isV2forCASPlanning, isV2forCASAdverts, isV2forAdverts, isV2forLDC] = await Promise.all([
		isLpaInFeatureFlag(appeal.lpaCode, FLAG.CAS_PLANNING_APPEAL_FORM_V2),
		isLpaInFeatureFlag(appeal.lpaCode, FLAG.CAS_ADVERTS_APPEAL_FORM_V2),
		isLpaInFeatureFlag(appeal.lpaCode, FLAG.ADVERTS_APPEAL_FORM_V2),
		isLpaInFeatureFlag(appeal.lpaCode, FLAG.LDC_APPEAL_FORM_V2)
	]);

	res.render(TYPE_OF_PLANNING_APPLICATION, {
		typeOfPlanningApplication: appeal.typeOfPlanningApplication,
		radioItems: typeOfPlanningApplicationRadioItems(
			isV2forCASPlanning,
			isV2forCASAdverts,
			isV2forAdverts,
			isV2forLDC,
			appeal.typeOfPlanningApplication
		)
	});
};

const postTypeOfPlanningApplication = async (req, res) => {
	const { body } = req;
	const { errors = {}, errorSummary = [] } = body;
	const { appeal } = req.session;

	const typeOfPlanningApplication = body['type-of-planning-application'];

	const [isV2forCASPlanning, isV2forCASAdverts, isV2forAdverts, isV2forLDC] = await Promise.all([
		isLpaInFeatureFlag(appeal.lpaCode, FLAG.CAS_PLANNING_APPEAL_FORM_V2),
		isLpaInFeatureFlag(appeal.lpaCode, FLAG.CAS_ADVERTS_APPEAL_FORM_V2),
		isLpaInFeatureFlag(appeal.lpaCode, FLAG.ADVERTS_APPEAL_FORM_V2),
		isLpaInFeatureFlag(appeal.lpaCode, FLAG.LDC_APPEAL_FORM_V2)
	]);

	// set isListedBuilding for the application types where we don't ask the listed building question
	let isListedBuilding = null;
	if (
		typeOfPlanningApplication !== REMOVAL_OR_VARIATION_OF_CONDITIONS &&
		typeOfPlanningApplication !== LAWFUL_DEVELOPMENT_CERTIFICATE
	) {
		isListedBuilding = typeOfPlanningApplication === LISTED_BUILDING;
	}

	if (errors['type-of-planning-application']) {
		return res.render(TYPE_OF_PLANNING_APPLICATION, {
			typeOfPlanningApplication,
			radioItems: typeOfPlanningApplicationRadioItems(
				isV2forCASPlanning,
				isV2forCASAdverts,
				isV2forAdverts,
				isV2forLDC,
				appeal.typeOfPlanningApplication
			),
			errors,
			errorSummary
		});
	}

	try {
		appeal.eligibility.isListedBuilding = isListedBuilding;
		appeal.appealType = mapPlanningApplication(typeOfPlanningApplication);
		appeal.typeOfPlanningApplication = typeOfPlanningApplication;
		req.session.appeal = await createOrUpdateAppeal(appeal);
	} catch (err) {
		logger.error(err);
		return res.render(TYPE_OF_PLANNING_APPLICATION, {
			typeOfPlanningApplication,
			radioItems: typeOfPlanningApplicationRadioItems(
				isV2forCASPlanning,
				isV2forCASAdverts,
				isV2forAdverts,
				isV2forLDC,
				appeal.typeOfPlanningApplication
			),
			errors,
			errorSummary: [{ text: err.toString(), href: '#' }]
		});
	}

	switch (typeOfPlanningApplication) {
		case HOUSEHOLDER_PLANNING:
			return res.redirect('/before-you-start/granted-or-refused-householder');
		case LISTED_BUILDING:
			return res.redirect('/before-you-start/granted-or-refused');
		case MINOR_COMMERCIAL_DEVELOPMENT:
			return isV2forCASPlanning
				? res.redirect('/before-you-start/planning-application-about')
				: res.redirect('/before-you-start/use-existing-service-application-type');
		case LAWFUL_DEVELOPMENT_CERTIFICATE:
			return isV2forLDC
				? res.redirect('/before-you-start/listed-building')
				: res.redirect('/before-you-start/use-existing-service-application-type');
		case ADVERTISEMENT:
			return isV2forCASAdverts || isV2forAdverts
				? res.redirect('/before-you-start/granted-or-refused')
				: res.redirect('/before-you-start/use-existing-service-application-type');
		case PRIOR_APPROVAL:
			return res.redirect('/before-you-start/prior-approval-existing-home');
		case REMOVAL_OR_VARIATION_OF_CONDITIONS:
			return res.redirect('/before-you-start/conditions-householder-permission');
		case SOMETHING_ELSE:
		case I_HAVE_NOT_MADE_A_PLANNING_APPLICATION:
			return res.redirect('/before-you-start/use-existing-service-application-type');
		default:
			return res.redirect('/before-you-start/granted-or-refused');
	}
};

module.exports = {
	getTypeOfPlanningApplication,
	postTypeOfPlanningApplication
};
