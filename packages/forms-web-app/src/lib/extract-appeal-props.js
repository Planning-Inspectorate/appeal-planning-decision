const { format, parseISO } = require('date-fns');
const { getDepartmentFromId } = require('../services/department.service');
const { capitalise } = require('./capitalised-dashed-strings');
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
		applicationType = capitalise(applicationType);
	}

	let { applicationDecision } = appeal.eligibility;
	if (applicationDecision === 'nodecisionreceived') {
		applicationDecision = 'No Decision Received';
	} else if (applicationDecision === 'granted') {
		applicationDecision = 'Granted with conditions';
	} else if (applicationDecision === 'refused') {
		applicationDecision = 'Refused';
	} else {
		applicationDecision = capitalise(applicationDecision);
	}

	const nextPageUrl = chooseAppropriateApplicationNumberPage(appeal);

	const decisionDate = format(parseISO(appeal.decisionDate), 'dd MMMM yyyy');

	const enforcementNotice = appeal.eligibility.enforcementNotice ? 'Yes' : 'No';

	const dateOfDecisionLabel =
		applicationDecision === 'No Decision Received' ? 'Date decision due' : 'Date of Decision';

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
