const { format } = require('date-fns');

/**
 * @typedef {import("../client/appeals-api-client").AppealCaseWithAppellant} AppealCaseWithAppellant
 */

/**
 * @param {AppealCaseWithAppellant} caseData
 * @param {keyof AppealCaseWithAppellant} propertyName
 */
exports.formatYesOrNo = (caseData, propertyName) => (caseData[propertyName] ? 'Yes' : 'No');

// TODO the associated changed and affected listed building numbers may be more than 1
// the current data model does not support multiple entries.
// function will need refactoring once data model updated
// /**
//  * @param {AppealCaseWithAppellant} caseData
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
 * @param {AppealCaseWithAppellant} caseData
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
 * @param {AppealCaseWithAppellant} caseData
 */
exports.formatSensitiveArea = (caseData) =>
	caseData.sensitiveArea ? `Yes\n${caseData.sensitiveAreaDetails ?? ''}` : 'No';

/**
 * @param {AppealCaseWithAppellant} caseData
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
 * @param {AppealCaseWithAppellant} caseData
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
//  * @param {AppealCaseWithAppellant} caseData
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
 * @param {String | undefined} dateStr
 */
exports.formatDate = (dateStr) => {
	if (!dateStr) {
		return '';
	}

	const date = new Date(dateStr);

	return format(date, 'dd-MMM-yyyy');
};

/**
 * @param {AppealCaseWithAppellant} caseData
 */
exports.formatSiteSafetyRisks = (caseData) => {
	if (caseData.lpaSiteSafetyRisks) {
		return `Yes\n${caseData.lpaSiteSafetyRiskDetails ?? ''}`;
	} else {
		return 'No';
	}
};

/**
 * @param {AppealCaseWithAppellant} caseData
 */
exports.formatProcedurePreference = (caseData) => {
	if (caseData.lpaProcedurePreference === 'written-representations') {
		return `Written representations`;
	} else if (caseData.lpaProcedurePreference === 'hearing') {
		return `Hearing\n${caseData.lpaPreferHearingDetails ?? ''}`;
	} else if (caseData.lpaProcedurePreference === 'inquiry') {
		return `Inquiry\n${caseData.lpaPreferInquiryDetails ?? ''}\nExpected duration: ${
			caseData.lpaPreferInquiryDuration ?? ''
		} days`;
	} else {
		return '';
	}
};

/**
 * @param {AppealCaseWithAppellant} caseData
 */
exports.formatConditions = (caseData) =>
	(caseData.newConditions && `Yes\n${caseData.newConditionDetails ?? ''}`) || 'No';
