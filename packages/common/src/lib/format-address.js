/**
 * @typedef {import('appeals-service-api').Api.AppealCaseWithAppellant} AppealCaseWithAppellant
 * @typedef {import('appeals-service-api').Api.AppealSubmission} AppealSubmission
 * @typedef {import('appeals-service-api').Api.NeighbouringAddress} NeighbouringAddress
 */

/**
 * @param {AppealCaseWithAppellant | AppealSubmission} appealCaseData
 * @param { boolean } breaks
 * @returns {string}
 */
const formatAddress = (appealCaseData, joinString = ', ') => {
	if (isAppealSubmission(appealCaseData)) {
		return formatAppealSubmissionAddress(appealCaseData);
	}

	const addressComponents = [
		appealCaseData.siteAddressLine1,
		appealCaseData.siteAddressLine2,
		appealCaseData.siteAddressTown,
		appealCaseData.siteAddressPostcode
	];

	return addressComponents.filter(Boolean).join(joinString);
};

/**
 * @param {AppealCaseWithAppellant | AppealSubmission} appealCaseData
 * @returns {string}
 */
const formatAddressWithBreaks = (appealCaseData) => {
	if (isAppealSubmission(appealCaseData)) {
		return formatAppealSubmissionAddress(appealCaseData);
	}

	const addressComponents = [
		appealCaseData.siteAddressLine1,
		appealCaseData.siteAddressLine2,
		appealCaseData.siteAddressTown,
		appealCaseData.siteAddressPostcode
	];

	return addressComponents.filter(Boolean).join('<br>');
};

/**
 * @param {AppealSubmission} appealSubmission
 * @returns {string}
 */
const formatAppealSubmissionAddress = (appealSubmission) => {
	if (!appealSubmission.appeal?.appealSiteSection?.siteAddress) {
		return '';
	}
	const address = appealSubmission.appeal?.appealSiteSection?.siteAddress;

	const addressComponents = [
		address.addressLine1,
		address.addressLine2,
		address.town,
		address.postcode
	];

	return addressComponents.filter(Boolean).join(', ');
};

/**
 * @param {NeighbouringAddress} neighbourAddress
 * @returns {string}
 */
const formatNeibouringAddressWithBreaks = (neighbourAddress) => {
	const addressComponents = [
		neighbourAddress.addressLine1,
		neighbourAddress.addressLine2,
		neighbourAddress.townCity,
		neighbourAddress.postcode
	];

	return addressComponents.filter(Boolean).join('<br>');
};

/**
 * @param {AppealSubmission | AppealCaseWithAppellant} caseOrSubmission
 * @returns {caseOrSubmission is AppealSubmission}
 */
function isAppealSubmission(caseOrSubmission) {
	return Object.hasOwn(caseOrSubmission, 'appeal');
}

module.exports = {
	formatAddress,
	formatAddressWithBreaks,
	formatNeibouringAddressWithBreaks,
	isAppealSubmission
};
