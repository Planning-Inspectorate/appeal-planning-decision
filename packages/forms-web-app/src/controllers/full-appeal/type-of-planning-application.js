const {
	constants: {
		TYPE_OF_PLANNING_APPLICATION: {
			HOUSEHOLDER_PLANNING,
			LISTED_BUILDING,
			ENFORCEMENT_NOTICE,
			ENFORCEMENT_LISTED_BUILDING,
			MINOR_COMMERCIAL_DEVELOPMENT,
			LAWFUL_DEVELOPMENT_CERTIFICATE,
			ADVERTISEMENT,
			I_HAVE_NOT_MADE_A_PLANNING_APPLICATION,
			PRIOR_APPROVAL,
			REMOVAL_OR_VARIATION_OF_CONDITIONS,
			SOMETHING_ELSE,
			FULL_APPEAL,
			OUTLINE_PLANNING,
			RESERVED_MATTERS
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

	const [isV2forLDC, isNewBYSFlow] = await Promise.all([
		isLpaInFeatureFlag(appeal.lpaCode, FLAG.LDC_APPEAL_FORM_V2),
		isLpaInFeatureFlag(appeal.lpaCode, FLAG.NEW_BYS_ENFORCEMENT)
	]);

	res.render(TYPE_OF_PLANNING_APPLICATION, {
		typeOfPlanningApplication: appeal.typeOfPlanningApplication,
		titleText: isNewBYSFlow
			? 'What is your appeal about?'
			: 'What type of application is your appeal about?',
		hint: isNewBYSFlow ? {} : { text: 'You can check this on your application form.' },
		radioItems: typeOfPlanningApplicationRadioItems(
			isV2forLDC,
			isNewBYSFlow,
			appeal.typeOfPlanningApplication
		)
	});
};

const postTypeOfPlanningApplication = async (req, res) => {
	const { body } = req;
	const { errors = {}, errorSummary = [] } = body;
	const { appeal } = req.session;

	const typeOfPlanningApplication = body['type-of-planning-application'];

	const [isV2forLDC, isNewBYSFlow] = await Promise.all([
		isLpaInFeatureFlag(appeal.lpaCode, FLAG.LDC_APPEAL_FORM_V2),
		isLpaInFeatureFlag(appeal.lpaCode, FLAG.NEW_BYS_ENFORCEMENT)
	]);

	// set isListedBuilding for the application types where we don't ask the listed building question
	let isListedBuilding = null;
	if (
		typeOfPlanningApplication !== REMOVAL_OR_VARIATION_OF_CONDITIONS &&
		typeOfPlanningApplication !== LAWFUL_DEVELOPMENT_CERTIFICATE
	) {
		isListedBuilding = typeOfPlanningApplication === LISTED_BUILDING;
	}

	// These two options will only be available if is NEW BYS Flow
	const isEnforcementOrELB =
		typeOfPlanningApplication === ENFORCEMENT_NOTICE ||
		typeOfPlanningApplication === ENFORCEMENT_LISTED_BUILDING;

	if (errors['type-of-planning-application']) {
		return res.render(TYPE_OF_PLANNING_APPLICATION, {
			typeOfPlanningApplication,
			titleText: isNewBYSFlow
				? 'What is your appeal about?'
				: 'What type of application is your appeal about?',
			hint: isNewBYSFlow ? {} : { text: 'You can check this on your application form.' },
			radioItems: typeOfPlanningApplicationRadioItems(
				isV2forLDC,
				isNewBYSFlow,
				appeal.typeOfPlanningApplication
			),
			errors,
			errorSummary
		});
	}

	try {
		appeal.eligibility = {
			...appeal.eligibility,
			isListedBuilding: isListedBuilding ? isListedBuilding : appeal.eligibility?.isListedBuilding,
			enforcementNotice: isEnforcementOrELB,
			enforcementNoticeListedBuilding: typeOfPlanningApplication === ENFORCEMENT_LISTED_BUILDING
		};
		appeal.appealType = mapPlanningApplication(typeOfPlanningApplication);
		appeal.typeOfPlanningApplication = typeOfPlanningApplication;
		req.session.appeal = await createOrUpdateAppeal(appeal);
	} catch (err) {
		logger.error(err);
		return res.render(TYPE_OF_PLANNING_APPLICATION, {
			typeOfPlanningApplication,
			radioItems: typeOfPlanningApplicationRadioItems(
				isV2forLDC,
				isNewBYSFlow,
				appeal.typeOfPlanningApplication
			),
			errors,
			errorSummary: [{ text: err.toString(), href: '#' }]
		});
	}

	switch (typeOfPlanningApplication) {
		case HOUSEHOLDER_PLANNING:
			return res.redirect('/before-you-start/application-date');
		case MINOR_COMMERCIAL_DEVELOPMENT:
			return res.redirect('/before-you-start/planning-application-about');
		case ADVERTISEMENT:
			return res.redirect('/before-you-start/granted-or-refused');
		case LISTED_BUILDING:
			return res.redirect('/before-you-start/granted-or-refused');
		case LAWFUL_DEVELOPMENT_CERTIFICATE:
			return isV2forLDC
				? res.redirect('/before-you-start/listed-building')
				: res.redirect('/before-you-start/use-existing-service-application-type');
		case PRIOR_APPROVAL:
			return res.redirect('/before-you-start/prior-approval-existing-home');
		case REMOVAL_OR_VARIATION_OF_CONDITIONS:
			return res.redirect('/before-you-start/conditions-householder-permission');
		case SOMETHING_ELSE:
		case I_HAVE_NOT_MADE_A_PLANNING_APPLICATION:
			return res.redirect('/before-you-start/cannot-use-this-service');
		case FULL_APPEAL:
		case OUTLINE_PLANNING:
		case RESERVED_MATTERS:
			return res.redirect('/before-you-start/application-date');
		// Enforcement types only available as options if isNewBYSFlow === true
		case ENFORCEMENT_NOTICE:
		case ENFORCEMENT_LISTED_BUILDING:
			return res.redirect('/before-you-start/enforcement-issue-date');
		default:
			return res.redirect('/before-you-start/granted-or-refused');
	}
};

module.exports = {
	getTypeOfPlanningApplication,
	postTypeOfPlanningApplication
};
