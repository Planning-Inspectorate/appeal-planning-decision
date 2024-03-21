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
// 		? allListedBuildings.join('<br>')
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
		return `Other<br>${caseData.otherDesignationDetails}`;
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
	caseData.sensitiveArea ? `Yes<br>${caseData.sensitiveAreaDetails}` : 'No';

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
 * @param {AppealCaseWithAppellant} caseData
 */
exports.formatDevelopmentDescription = (caseData) => {
	switch (caseData.developmentDescription) {
		case 'agriculture-aquaculture':
			return 'Agriculture and aquaculture';
		case 'change-extensions':
			return 'Changes and extensions';
		case 'chemical-industry':
			return 'Chemical industry';
		case 'energy-industry':
			return 'Energy industry';
		case 'extractive-industry':
			return 'Extractive industry';
		case 'food-industry':
			return 'Food industry';
		case 'infrastructure-projects':
			return 'Infrastructure projects';
		case 'mineral-industry':
			return 'Mineral industry';
		case 'other-projects':
			return 'Other projects';
		case 'production-processing-of-metals':
			return 'Production and processing of metals';
		case 'rubber-industry':
			return 'Rubber industry';
		case 'textile-industries':
			return 'Textile, leather, wood and paper industries';
		case 'tourism-leisure':
			return 'Tourism and leisure';
		default:
			return 'None';
	}
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
// 	return notifcationTypes.join('<br>');
// };

/**
 * @param {String | undefined} dateStr
 */
exports.formatDate = (dateStr) => {
	if (!dateStr) {
		return '';
	}

	const date = new Date(dateStr);

	const day = date.getDate().toString().padStart(2, '0');
	const month = (date.getMonth() + 1).toString().padStart(2, '0');
	const year = date.getFullYear();

	return `${day}-${month}-${year}`;
};

/**
 * @param {AppealCaseWithAppellant} caseData
 */
exports.formatSiteSafetyRisks = (caseData) => {
	if (caseData.lpaSiteSafetyRisks) {
		return `Yes<br>${caseData.lpaSiteSafetyRiskDetails}`;
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
		return `Hearing<br>${caseData.lpaPreferHearingDetails}`;
	} else if (caseData.lpaProcedurePreference === 'inquiry') {
		return `Inquiry<br>${caseData.lpaPreferInquiryDetails}<br>Expected duration: ${caseData.lpaPreferInquiryDuration} days`;
	} else {
		return '';
	}
};

/**
 * @param {AppealCaseWithAppellant} caseData
 */
exports.formatConditions = (caseData) =>
	caseData.newConditions === true ? `Yes<br>${caseData.newConditionDetails}` : 'No';
