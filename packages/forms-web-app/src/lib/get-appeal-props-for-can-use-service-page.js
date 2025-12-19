const { format, parseISO } = require('date-fns');
const { getDepartmentFromId } = require('../services/department.service');
const { removeDashesAndCapitaliseString } = require('./capitalised-dashed-strings');
const { getNextPageFromCanUseServicePage } = require('./get-next-page-from-can-use-service-page');
const {
	APPLICATION_ABOUT_LABELS,
	APPLICATION_DECISION,
	TYPE_OF_PLANNING_APPLICATION
} = require('@pins/business-rules/src/constants');

const getAppealPropsForCanUseServicePage = async (appeal) => {
	let appealLPD = '';

	if (appeal.lpaCode) {
		const lpd = await getDepartmentFromId(appeal.lpaCode);
		if (lpd) {
			appealLPD = lpd.name;
		}
	}

	const planningApplicationNumber = appeal.planningApplicationNumber;

	let applicationType;

	if (appeal.typeOfPlanningApplication) {
		applicationType = appeal.typeOfPlanningApplication;
		applicationType =
			applicationType === TYPE_OF_PLANNING_APPLICATION.LISTED_BUILDING
				? 'Listed building consent'
				: (applicationType = removeDashesAndCapitaliseString(applicationType));
	}

	let { applicationDecision = '' } = appeal.eligibility;
	if (applicationDecision === APPLICATION_DECISION.NODECISIONRECEIVED) {
		applicationDecision = 'No decision received';
	} else if (applicationDecision === APPLICATION_DECISION.GRANTED) {
		applicationDecision = 'Granted with conditions';
	} else if (applicationDecision === APPLICATION_DECISION.REFUSED) {
		applicationDecision = 'Refused';
	} else {
		applicationDecision = removeDashesAndCapitaliseString(applicationDecision);
	}

	const nextPageUrl = await getNextPageFromCanUseServicePage(appeal);
	const hideDecisionDate =
		appeal.typeOfPlanningApplication ===
			TYPE_OF_PLANNING_APPLICATION.LAWFUL_DEVELOPMENT_CERTIFICATE &&
		!appeal.eligibility.isListedBuilding;
	const hideGrantedRefused = hideDecisionDate; // currently only LDC S191/S192 hides decision date so also hide granted/refused
	const hideListedBuilding =
		appeal.typeOfPlanningApplication !==
		TYPE_OF_PLANNING_APPLICATION.LAWFUL_DEVELOPMENT_CERTIFICATE; // currently only LDC asks the listed building question and uses this template

	let isListedBuilding = null;
	if (appeal.eligibility.isListedBuilding !== undefined) {
		isListedBuilding = appeal.eligibility.isListedBuilding ? 'Yes' : 'No';
	}

	const decisionDate = hideDecisionDate
		? null
		: format(parseISO(appeal.decisionDate), 'dd MMMM yyyy');

	const enforcementNotice = appeal.eligibility.enforcementNotice ? 'Yes' : 'No';

	const dateOfDecisionLabel =
		applicationDecision === 'No decision received' ? 'Date decision due' : 'Date of decision';

	let applicationAbout = null;
	const isMinorCommercial =
		appeal.typeOfPlanningApplication === TYPE_OF_PLANNING_APPLICATION.MINOR_COMMERCIAL_DEVELOPMENT;

	if (
		isMinorCommercial &&
		appeal.eligibility.planningApplicationAbout &&
		appeal.eligibility.planningApplicationAbout.length > 0
	) {
		applicationAbout = appeal.eligibility.planningApplicationAbout
			.filter((about) => APPLICATION_ABOUT_LABELS[about])
			.map((about) => APPLICATION_ABOUT_LABELS[about]);
	}

	return {
		appealLPD,
		planningApplicationNumber,
		applicationType,
		applicationAbout,
		applicationDecision,
		decisionDate,
		enforcementNotice,
		dateOfDecisionLabel,
		nextPageUrl,
		hideListedBuilding,
		isListedBuilding,
		hideGrantedRefused,
		hideDecisionDate
	};
};

module.exports = { getAppealPropsForCanUseServicePage };
