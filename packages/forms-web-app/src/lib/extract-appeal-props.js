const { format, parseISO } = require('date-fns');
const { getDepartmentFromId } = require('../services/department.service');
const { removeDashesAndCapitaliseString } = require('./capitalised-dashed-strings');
const {
	chooseAppropriateApplicationNumberPage
} = require('./choose-appropriate-application-number-page');

const extractAppealProps = async (appeal) => {
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
		applicationType = removeDashesAndCapitaliseString(applicationType);
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

	const nextPageUrl = chooseAppropriateApplicationNumberPage(appeal);

	const decisionDate = format(parseISO(appeal.decisionDate), 'dd MMMM yyyy');

	const enforcementNotice = appeal.eligibility.enforcementNotice ? 'Yes' : 'No';

	const dateOfDecisionLabel =
		applicationDecision === 'No decision received' ? 'Date decision due' : 'Date of decision';

	return {
		appealLPD,
		applicationType,
		applicationDecision,
		decisionDate,
		enforcementNotice,
		dateOfDecisionLabel,
		nextPageUrl
	};
};

module.exports = { extractAppealProps };
