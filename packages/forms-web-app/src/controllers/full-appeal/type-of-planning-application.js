const {
	constants: {
		TYPE_OF_PLANNING_APPLICATION: {
			HOUSEHOLDER_PLANNING,
			LISTED_BUILDING,
			MINOR_COMMERCIAL_DEVELOPMENT,
			MINOR_COMMERCIAL_ADVERTISEMENT,
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

	const [isV2forS20, isV2forCASPlanning, isV2forCASAdverts] = await Promise.all([
		isLpaInFeatureFlag(appeal.lpaCode, FLAG.S20_APPEAL_FORM_V2),
		isLpaInFeatureFlag(appeal.lpaCode, FLAG.CAS_PLANNING_APPEAL_FORM_V2),
		isLpaInFeatureFlag(appeal.lpaCode, FLAG.CAS_ADVERTS_APPEAL_FORM_V2)
	]);

	res.render(TYPE_OF_PLANNING_APPLICATION, {
		typeOfPlanningApplication: appeal.typeOfPlanningApplication,
		radioItems: typeOfPlanningApplicationRadioItems(
			isV2forS20,
			isV2forCASPlanning,
			isV2forCASAdverts,
			appeal.typeOfPlanningApplication
		)
	});
};

const postTypeOfPlanningApplication = async (req, res) => {
	const { body } = req;
	const { errors = {}, errorSummary = [] } = body;
	const { appeal } = req.session;

	const typeOfPlanningApplication = body['type-of-planning-application'];

	const [isV2forS20, isV2forCASPlanning, isV2forS78, isV2forCASAdverts] = await Promise.all([
		isLpaInFeatureFlag(appeal.lpaCode, FLAG.S20_APPEAL_FORM_V2),
		isLpaInFeatureFlag(appeal.lpaCode, FLAG.CAS_PLANNING_APPEAL_FORM_V2),
		isLpaInFeatureFlag(appeal.lpaCode, FLAG.S78_APPEAL_FORM_V2),
		isLpaInFeatureFlag(appeal.lpaCode, FLAG.CAS_ADVERTS_APPEAL_FORM_V2)
	]);

	let isListedBuilding = null;
	if (isV2forS20 && typeOfPlanningApplication !== REMOVAL_OR_VARIATION_OF_CONDITIONS) {
		isListedBuilding = typeOfPlanningApplication === LISTED_BUILDING;
	}

	if (errors['type-of-planning-application']) {
		return res.render(TYPE_OF_PLANNING_APPLICATION, {
			typeOfPlanningApplication,
			radioItems: typeOfPlanningApplicationRadioItems(
				isV2forS20,
				isV2forCASPlanning,
				isV2forCASAdverts,
				appeal.typeOfPlanningApplication
			),
			errors,
			errorSummary
		});
	}

	try {
		if (isV2forS20) {
			appeal.eligibility.isListedBuilding = isListedBuilding;
		}
		appeal.appealType = mapPlanningApplication(typeOfPlanningApplication);
		appeal.typeOfPlanningApplication = typeOfPlanningApplication;
		req.session.appeal = await createOrUpdateAppeal(appeal);
	} catch (err) {
		logger.error(err);
		return res.render(TYPE_OF_PLANNING_APPLICATION, {
			typeOfPlanningApplication,
			radioItems: typeOfPlanningApplicationRadioItems(
				isV2forS20,
				isV2forCASPlanning,
				isV2forCASAdverts,
				appeal.typeOfPlanningApplication
			),
			errors,
			errorSummary: [{ text: err.toString(), href: '#' }]
		});
	}

	switch (typeOfPlanningApplication) {
		case HOUSEHOLDER_PLANNING:
			return isV2forS20
				? res.redirect('/before-you-start/granted-or-refused-householder')
				: res.redirect('/before-you-start/listed-building-householder');
		case LISTED_BUILDING:
			// if somehow appeal type is listed-building and lpa is v1,
			// redirect to existing listed-building page which links to ACP
			return isV2forS20
				? res.redirect('/before-you-start/granted-or-refused')
				: res.redirect('/before-you-start/listed-building');
		case MINOR_COMMERCIAL_DEVELOPMENT:
			return isV2forCASPlanning
				? res.redirect('/before-you-start/planning-application-about')
				: res.redirect('/before-you-start/use-existing-service-application-type');
		case MINOR_COMMERCIAL_ADVERTISEMENT:
			return isV2forCASAdverts
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
			if (isV2forS20) {
				return res.redirect('/before-you-start/granted-or-refused');
			} else if (isV2forS78) {
				return res.redirect('/before-you-start/listed-building');
			} else {
				return res.redirect('/before-you-start/any-of-following'); // v1 redirect
			}
	}
};

module.exports = {
	getTypeOfPlanningApplication,
	postTypeOfPlanningApplication
};
