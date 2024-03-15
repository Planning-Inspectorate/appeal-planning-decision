/**
 * @typedef {import("../client/appeals-api-client").AppealCaseWithAppellant} AppealCaseWithAppellant
 */

/**
 * @param {AppealCaseWithAppellant} caseData
 * @param {keyof AppealCaseWithAppellant} propertyName
 */
exports.formatYesOrNo = (caseData, propertyName) => (caseData[propertyName] ? 'Yes' : 'No');

/**
 * @param {AppealCaseWithAppellant} caseData
 */
exports.formatListedBuildings = (caseData) => {
	const allListedBuildings = [];
	const changedListedBuildingNumber = caseData.changedListedBuildingNumber;
	const affectedListedBuildingNumber = caseData.affectedListedBuildingNumber;
	const listedBuildingUrl = 'https://historicengland.org.uk/listing/the-list/list-entry/';

	if (!changedListedBuildingNumber && !affectedListedBuildingNumber) {
		return '';
	}

	if (changedListedBuildingNumber) {
		allListedBuildings.push(
			`<a href="${listedBuildingUrl}${changedListedBuildingNumber}">${changedListedBuildingNumber}</a>`
		);
	}

	if (affectedListedBuildingNumber) {
		allListedBuildings.push(
			`<a href="${listedBuildingUrl}${affectedListedBuildingNumber}">${affectedListedBuildingNumber}</a>`
		);
	}

	return allListedBuildings.length > 1
		? allListedBuildings.join('<br>')
		: allListedBuildings.toString();
};

/**
 * @param {AppealCaseWithAppellant} caseData
 */
exports.formatDesignations = (caseData) => {
	if (caseData.designatedSites === 'None') {
		return 'No';
	}

	if (caseData.designatedSites === 'other' && caseData.otherDesignationDetails) {
		return caseData.otherDesignationDetails;
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
