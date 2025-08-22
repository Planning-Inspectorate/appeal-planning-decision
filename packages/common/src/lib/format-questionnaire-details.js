const {
	APPEAL_CASE_PROCEDURE,
	APPEAL_EIA_ENVIRONMENTAL_IMPACT_SCHEDULE
} = require('@planning-inspectorate/data-model');

/**
 * @typedef {import("../client/appeals-api-client").AppealCaseDetailed} AppealCaseDetailed
 */

/**
 * @param {AppealCaseDetailed} caseData
 * @param {keyof AppealCaseDetailed} propertyName
 */
exports.formatYesOrNo = (caseData, propertyName) => boolToYesNo(caseData[propertyName]);

/**
 * if boolean then will return Yes/No string, otherwise empty string
 * @param {any} check
 * @returns {String}
 */
const boolToYesNo = (check) => {
	if (check === false) return 'No';
	if (check === true) return 'Yes';

	return '';
};

exports.boolToYesNo = boolToYesNo;

/**
 * @param {AppealCaseDetailed} caseData
 */
exports.formatDesignations = (caseData) => {
	if (!caseData.designatedSitesNames || caseData.designatedSitesNames.length === 0) {
		return 'No';
	}

	return caseData.designatedSitesNames.join('\n');
};

/**
 * @param {AppealCaseDetailed} caseData
 */
exports.formatSensitiveArea = (caseData) =>
	caseData.sensitiveAreaDetails ? `Yes\n${caseData.sensitiveAreaDetails ?? ''}` : 'No';

/**
 * @param {AppealCaseDetailed} caseData
 */
exports.formatEnvironmentalImpactSchedule = (caseData) => {
	if (
		caseData.environmentalImpactSchedule === APPEAL_EIA_ENVIRONMENTAL_IMPACT_SCHEDULE.SCHEDULE_1
	) {
		return 'Schedule 1';
	}

	if (
		caseData.environmentalImpactSchedule === APPEAL_EIA_ENVIRONMENTAL_IMPACT_SCHEDULE.SCHEDULE_2
	) {
		return 'Schedule 2';
	}

	return 'Other';
};

/**
 * @type {Object.<string, string>}
 */
const developmentDescriptions = {
	'agriculture-aquaculture': 'Agriculture and aquaculture',
	'change-extensions': 'Changes and extensions',
	'chemical-industry': 'Chemical industry',
	'energy-industry': 'Energy industry',
	'extractive-industry': 'Extractive industry',
	'food-industry': 'Food industry',
	'infrastructure-projects': 'Infrastructure projects',
	'mineral-industry': 'Mineral industry',
	'other-projects': 'Other projects',
	'production-processing-of-metals': 'Production and processing of metals',
	'rubber-industry': 'Rubber industry',
	'textile-industries': 'Textile, leather, wood and paper industries',
	'tourism-leisure': 'Tourism and leisure'
};

/**
 * @param {AppealCaseDetailed} caseData
 */
exports.formatDevelopmentDescription = (caseData) => {
	const key = caseData.developmentDescription;
	return key !== undefined && key in developmentDescriptions
		? developmentDescriptions[key]
		: 'None';
};

/**
 * @param {AppealCaseDetailed} caseData
 * @returns {string} safety details provided by LPA User
 */
exports.formatSiteSafetyRisks = (caseData) => {
	if (!caseData.siteSafetyDetails || !caseData.siteSafetyDetails[1]) return 'No';

	const details = caseData.siteSafetyDetails[1];

	return `Yes\n${details}`;
};

/**
 * @param {AppealCaseDetailed} caseData
 * @returns {string} access details provided by LPA User
 */
exports.formatSiteAccessDetails = (caseData) => {
	if (!caseData.siteAccessDetails || !caseData.siteAccessDetails[1]) return '';
	return caseData.siteAccessDetails[1];
};

/**
 * @param {AppealCaseDetailed} caseData
 */
exports.formatProcedurePreference = (caseData) => {
	if (caseData.lpaProcedurePreference === APPEAL_CASE_PROCEDURE.WRITTEN) {
		return `Written representations`;
	} else if (caseData.lpaProcedurePreference === APPEAL_CASE_PROCEDURE.HEARING) {
		return `Hearing\n${caseData.lpaProcedurePreferenceDetails ?? ''}`;
	} else if (caseData.lpaProcedurePreference === APPEAL_CASE_PROCEDURE.INQUIRY) {
		return `Inquiry\n${caseData.lpaProcedurePreferenceDetails ?? ''}\nExpected duration: ${
			caseData.lpaProcedurePreferenceDuration ?? ''
		} days`;
	} else {
		return '';
	}
};

/**
 * @param {AppealCaseDetailed} caseData
 */
exports.formatConditions = (caseData) =>
	(caseData.newConditionDetails && `Yes\n${caseData.newConditionDetails ?? ''}`) || 'No';
