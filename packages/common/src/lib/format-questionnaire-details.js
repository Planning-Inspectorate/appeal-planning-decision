/**
 * @typedef {import("../client/appeals-api-client").AppealCaseWithAppellant} AppealCaseWithAppellant
 */

/**
 * @param {AppealCaseWithAppellant} questionnaireData
 * @param {keyof AppealCaseWithAppellant} propertyName
 */
exports.formatYesOrNo = (questionnaireData, propertyName) => {
	return questionnaireData[propertyName] === true ? 'Yes' : 'No';
};

/**
 * @param {AppealCaseWithAppellant} questionnaireData
 */
exports.formatListedBuildings = (questionnaireData) => {
	const allListedBuildings = [];
	const changedListedBuildingNumber = questionnaireData.changedListedBuildingNumber;
	const affectedListedBuildingNumber = questionnaireData.affectedListedBuildingNumber;
	const listedBuildingUrl = 'https://historicengland.org.uk/listing/the-list/list-entry/';

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

	if (allListedBuildings.length === 0) {
		return '';
	}

	return allListedBuildings.length > 1
		? allListedBuildings.join('<br>')
		: allListedBuildings.toString();
};
