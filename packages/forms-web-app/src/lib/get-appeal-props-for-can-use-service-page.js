const { format, parseISO } = require('date-fns');
const { getDepartmentFromId } = require('../services/department.service');
const { removeDashesAndCapitaliseString } = require('./capitalised-dashed-strings');
const { getNextPageFromCanUseServicePage } = require('./get-next-page-from-can-use-service-page');
const {
	TYPE_OF_PLANNING_APPLICATION,
	APPLICATION_ABOUT_LABELS
} = require('@pins/business-rules/src/constants');

const getAppealPropsForCanUseServicePage = async (appeal) => {
	let appealLPD = '';

	if (appeal.lpaCode) {
		const lpd = await getDepartmentFromId(appeal.lpaCode);
		if (lpd) {
			appealLPD = lpd.name;
		}
	}

	let applicationType;

	if (appeal.typeOfPlanningApplication) {
		applicationType = appeal.typeOfPlanningApplication;
		applicationType =
			applicationType === TYPE_OF_PLANNING_APPLICATION.LISTED_BUILDING
				? 'Listed building consent'
				: (applicationType = removeDashesAndCapitaliseString(applicationType));
	}

	let { applicationDecision } = appeal.eligibility;
	if (applicationDecision === 'nodecisionreceived') {
		applicationDecision = 'No decision received';
	} else if (applicationDecision === 'granted') {
		applicationDecision = 'Granted with conditions';
	} else if (applicationDecision === 'refused') {
		applicationDecision = 'Refused';
	} else {
		applicationDecision = removeDashesAndCapitaliseString(applicationDecision);
	}

	const nextPageUrl = await getNextPageFromCanUseServicePage(appeal);

	const decisionDate = format(parseISO(appeal.decisionDate), 'dd MMMM yyyy');

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
		applicationType,
		applicationAbout,
		applicationDecision,
		decisionDate,
		enforcementNotice,
		dateOfDecisionLabel,
		nextPageUrl
	};
};

module.exports = { getAppealPropsForCanUseServicePage };
