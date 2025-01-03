const { APPEAL_CASE_PROCEDURE } = require('pins-data-model');

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

// TODO the associated changed and affected listed building numbers may be more than 1
// the current data model does not support multiple entries.
// function will need refactoring once data model updated
// /**
//  * @param {AppealCaseDetailed} caseData
//  */
// exports.formatListedBuildings = (caseData) => {
// 	const allListedBuildings = [];
// 	const changedListedBuildingNumber = caseData.changedListedBuildingNumber;
// 	const affectedListedBuildingNumber = caseData.affectedListedBuildingNumber;
// 	const listedBuildingUrl = 'https://historicengland.org.uk/listing/the-list/list-entry/';

// 	if (!changedListedBuildingNumber && !affectedListedBuildingNumber) {
// 		return '';
// 	}

// 	if (changedListedBuildingNumber) {
// 		allListedBuildings.push(
// 			`<a href="${listedBuildingUrl}${changedListedBuildingNumber}">${changedListedBuildingNumber}</a>`
// 		);
// 	}

// 	if (affectedListedBuildingNumber) {
// 		allListedBuildings.push(
// 			`<a href="${listedBuildingUrl}${affectedListedBuildingNumber}">${affectedListedBuildingNumber}</a>`
// 		);
// 	}

// 	return allListedBuildings.length > 1
// 		? allListedBuildings.join('\n')
// 		: allListedBuildings.toString();
// };

/**
 * @param {AppealCaseDetailed} caseData
 */
exports.formatDesignations = (caseData) => {
	if (caseData.designatedSites === 'None') {
		return 'No';
	}

	if (caseData.designatedSites === 'other' && caseData.otherDesignationDetails) {
		return `Other\n${caseData.otherDesignationDetails}`;
	}

	if (caseData.designatedSites && caseData.designatedSites !== 'None') {
		return caseData.designatedSites;
	}

	return '';
};

/**
 * @param {AppealCaseDetailed} caseData
 */
exports.formatSensitiveArea = (caseData) =>
	caseData.sensitiveArea ? `Yes\n${caseData.sensitiveAreaDetails ?? ''}` : 'No';

/**
 * @param {AppealCaseDetailed} caseData
 */
exports.formatEnvironmentalImpactSchedule = (caseData) => {
	if (caseData.environmentalImpactSchedule === 'schedule-1') {
		return 'Schedule 1';
	}

	if (caseData.environmentalImpactSchedule === 'schedule-2') {
		return 'Schedule 2';
	}

	return 'No';
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

// TODO the associated question is checkbox meaning there could be multiple answers
// notificationMethod is currently a string
// ? should this be an array of strings in schema or need a relation table
// function will need refactoring when data model corrected
// /**
//  * @param {AppealCaseDetailed} caseData
//  */
// exports.formatNotificationMethod = (caseData) => {
// 	/**
// 	 * @type {string[]}
// 	 */
// 	const notifcationTypes = [];
// 	if (caseData.notificationMethod) {
// 		const types = caseData.notificationMethod.split(' ');
// 		types.forEach((type) => {
// 			if (type === 'site-notice') {
// 				notifcationTypes.push('A site notice');
// 			}
// 			if (type === 'letters-or-emails') {
// 				notifcationTypes.push('Letter sent to neighbours');
// 			}
// 			if (type === 'advert') {
// 				notifcationTypes.push('Press advert');
// 			}
// 		});
// 	}
// 	if (!notifcationTypes) {
// 		return 'None';
// 	}
// 	return notifcationTypes.join('\n');
// };

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
