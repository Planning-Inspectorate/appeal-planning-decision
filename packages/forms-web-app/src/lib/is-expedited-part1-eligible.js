const { isValid, parseISO } = require('date-fns');
const { formatInTimeZone } = require('date-fns-tz');
const {
	constants: { TYPE_OF_PLANNING_APPLICATION, APPLICATION_DECISION }
} = require('@pins/business-rules');

const EXPEDITED_PART_1_CUTOFF_DATE = '2026-04-01';
const UK_TIME_ZONE = 'Europe/London';

const eligiblePlanningApplicationTypes = new Set([
	TYPE_OF_PLANNING_APPLICATION.FULL_APPEAL,
	TYPE_OF_PLANNING_APPLICATION.OUTLINE_PLANNING,
	TYPE_OF_PLANNING_APPLICATION.RESERVED_MATTERS
]);

const eligibleApplicationDecisions = new Set([
	APPLICATION_DECISION.GRANTED,
	APPLICATION_DECISION.REFUSED
]);

/**
 * @param {string|Date|undefined|null} value
 * @returns {Date|null}
 */
const parseApplicationDate = (value) => {
	if (!value) {
		return null;
	}

	const parsedDate = value instanceof Date ? value : parseISO(value);
	return isValid(parsedDate) ? parsedDate : null;
};

/**
 * @param {{ applicationDate?: string|Date|null, typeOfPlanningApplication?: string|null, eligibility?: { applicationDecision?: string|null } } | undefined | null} appeal
 * @returns {boolean}
 */
const isExpeditedPart1Eligible = (appeal) => {
	if (
		!eligiblePlanningApplicationTypes.has(appeal?.typeOfPlanningApplication || '') ||
		!eligibleApplicationDecisions.has(appeal?.eligibility?.applicationDecision || '')
	) {
		return false;
	}

	const applicationDate = parseApplicationDate(appeal?.applicationDate);
	if (!applicationDate) {
		return false;
	}

	return (
		formatInTimeZone(applicationDate, UK_TIME_ZONE, 'yyyy-MM-dd') >= EXPEDITED_PART_1_CUTOFF_DATE
	);
};

module.exports = {
	EXPEDITED_PART_1_CUTOFF_DATE,
	isExpeditedPart1Eligible
};
