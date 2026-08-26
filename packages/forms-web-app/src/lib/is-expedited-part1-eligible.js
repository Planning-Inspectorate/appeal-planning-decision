const { isValid, parseISO } = require('date-fns');
const { formatInTimeZone } = require('date-fns-tz');
const {
	constants: { TYPE_OF_PLANNING_APPLICATION, APPLICATION_DECISION }
} = require('@pins/business-rules');
const { CASE_TYPES } = require('@pins/common/src/database/data-static');

const EXPEDITED_PART_1_CUTOFF_DATE = '2026-04-01';
const UK_TIME_ZONE = 'Europe/London';

const eligiblePlanningApplicationTypes = new Set([
	TYPE_OF_PLANNING_APPLICATION.FULL_APPEAL,
	TYPE_OF_PLANNING_APPLICATION.OUTLINE_PLANNING,
	TYPE_OF_PLANNING_APPLICATION.RESERVED_MATTERS,
	TYPE_OF_PLANNING_APPLICATION.PRIOR_APPROVAL,
	TYPE_OF_PLANNING_APPLICATION.REMOVAL_OR_VARIATION_OF_CONDITIONS,
	TYPE_OF_PLANNING_APPLICATION.PERMISSION_IN_PRINCIPLE
]);

/** @type {Set<string>} */
const eligibleAppealTypesForPart1 = new Set([CASE_TYPES.S78.processCode]);

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
 * @param {{ applicationDate?: string|Date|null, typeOfPlanningApplication?: string|null, eligibility?: { applicationDecision?: string|null }, appealTypeCode?: string |null, typeDevelopment?: string|null, developmentType?: string|null } | undefined | null} appeal
 * @returns {boolean}
 */
const isS78ExpeditedPart1Eligible = (appeal) => {
	if (!eligibleAppealTypesForPart1.has(appeal?.appealTypeCode || '')) {
		return false;
	}

	if (
		appeal?.typeOfPlanningApplication ===
			TYPE_OF_PLANNING_APPLICATION.MINOR_COMMERCIAL_DEVELOPMENT ||
		appeal?.typeOfPlanningApplication === TYPE_OF_PLANNING_APPLICATION.HOUSEHOLDER_PLANNING
	) {
		if (appeal?.eligibility?.applicationDecision !== APPLICATION_DECISION.GRANTED) {
			return false;
		}
	} else {
		if (
			!eligiblePlanningApplicationTypes.has(appeal?.typeOfPlanningApplication || '') ||
			!eligibleApplicationDecisions.has(appeal?.eligibility?.applicationDecision || '')
		) {
			return false;
		}
	}

	const applicationDate = parseApplicationDate(appeal?.applicationDate);
	if (!applicationDate) {
		return false;
	}

	return (
		formatInTimeZone(applicationDate, UK_TIME_ZONE, 'yyyy-MM-dd') >= EXPEDITED_PART_1_CUTOFF_DATE
	);
};

/**
 * @param {string|Date|undefined|null} value
 * @returns {boolean}
 */
const isExpeditedAppealDate = (value) => {
	const applicationDate = parseApplicationDate(value);
	if (!applicationDate) {
		return false;
	}

	return (
		formatInTimeZone(applicationDate, UK_TIME_ZONE, 'yyyy-MM-dd') >= EXPEDITED_PART_1_CUTOFF_DATE
	);
};

/** @type {Set<string>} */
const expeditedNonS78AppealTypeCodes = new Set([
	CASE_TYPES.HAS.processCode,
	CASE_TYPES.CAS_ADVERTS.processCode,
	CASE_TYPES.CAS_PLANNING.processCode
]);

/**
 * @param {string|null|undefined} appealTypeCode
 * @param {string|Date|null|undefined} applicationDate
 * @returns {boolean}
 */
const isNonS78ExpeditedPart1Eligible = (appealTypeCode, applicationDate) => {
	if (!appealTypeCode || !expeditedNonS78AppealTypeCodes.has(appealTypeCode)) {
		return false;
	}

	return isExpeditedAppealDate(applicationDate);
};

/**
 * @param {Object} [caseData]
 * @returns {boolean}
 */
const isExpeditedPart1Eligible = (caseData) => {
	if (!caseData) {
		return false;
	}

	return (
		isS78ExpeditedPart1Eligible({
			...caseData,
			eligibility: { applicationDecision: caseData.applicationDecision }
		}) || isNonS78ExpeditedPart1Eligible(caseData.appealTypeCode, caseData.applicationDate)
	);
};

module.exports = {
	EXPEDITED_PART_1_CUTOFF_DATE,
	isS78ExpeditedPart1Eligible,
	isExpeditedAppealDate,
	isNonS78ExpeditedPart1Eligible,
	isExpeditedPart1Eligible
};
