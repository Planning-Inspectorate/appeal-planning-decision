/**
 * @typedef {import('appeals-service-api').Api.AppealCaseDetailed} AppealCaseDetailed
 * @typedef {import('appeals-service-api').Api.AppealSubmission} AppealSubmission
 * @typedef {import('appeals-service-api').Api.AppellantSubmission} AppellantSubmission
 * @typedef {import('appeals-service-api').Api.NeighbouringAddress} NeighbouringAddress
 * @typedef {import('appeals-service-api').Api.SubmissionAddress} SubmissionAddress
 */

/**
 * @param {AppealCaseDetailed | AppealSubmission} appealCaseData
 * @param {string } [joinString]
 * @returns {string}
 */
const formatAddress = (appealCaseData, joinString = ', ') => {
	if (joinString.includes('<')) {
		throw new Error('unsafe joinString');
	}

	if (isAppealSubmission(appealCaseData) || isV2Submission(appealCaseData)) {
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
 * @param {AppealCaseDetailed | AppealSubmission} appealCaseData
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

	return addressComponents.filter(Boolean).join('\n');
};

/**
 * @param {AppealSubmission| AppellantSubmission} appealSubmission
 * @returns {string}
 */
const formatAppealSubmissionAddress = (appealSubmission) => {
	if (isAppealSubmission(appealSubmission)) {
		if (!appealSubmission.appeal?.appealSiteSection?.siteAddress) {
			return '';
		}
		const address = appealSubmission.appeal?.appealSiteSection?.siteAddress;

		const addressComponents = [
			address.addressLine1,
			address.addressLine2,
			address.town,
			address.county,
			address.postcode
		];

		return addressComponents.filter(Boolean).join(', ');
	} else if (isV2Submission(appealSubmission)) {
		// appellant submission should only contain one address
		const v2Address = appealSubmission?.AppellantSubmission?.SubmissionAddress[0];
		if (!v2Address) {
			return '';
		}

		const addressComponents = [
			v2Address.addressLine1,
			v2Address.addressLine2,
			v2Address.townCity,
			v2Address.county,
			v2Address.postcode
		];
		return addressComponents.filter(Boolean).join(', ');
	} else {
		return '';
	}
};

/**
 * @param {NeighbouringAddress} neighbourAddress
 * @returns {string}
 */
const formatNeighbouringAddressWithBreaks = (neighbourAddress) => {
	const addressComponents = [
		neighbourAddress.addressLine1,
		neighbourAddress.addressLine2,
		neighbourAddress.townCity,
		neighbourAddress.postcode
	];

	return addressComponents.filter(Boolean).join('\n');
};

/**
 * @param {SubmissionAddress} submissionAddress
 * @returns {string}
 */
const formatSubmissionAddress = (submissionAddress, joinString = ', ') => {
	const addressComponents = [
		submissionAddress.addressLine1,
		submissionAddress.addressLine2,
		submissionAddress.townCity,
		submissionAddress.county,
		submissionAddress.postcode
	];

	return addressComponents.filter(Boolean).join(joinString);
};

/**
 * @param {AppealSubmission | AppealCaseDetailed} caseOrSubmission
 * @returns {caseOrSubmission is AppealSubmission}
 */
function isAppealSubmission(caseOrSubmission) {
	return Object.hasOwn(caseOrSubmission, 'appeal');
}

/**
 * @param {AppealSubmission | AppealCaseDetailed} caseOrSubmission
 * @returns {boolean}
 */
function isV2Submission(caseOrSubmission) {
	if (caseOrSubmission?.AppellantSubmission?.submitted === false) {
		return true;
	}
	return false;
}

module.exports = {
	formatAddress,
	formatAddressWithBreaks,
	formatNeighbouringAddressWithBreaks,
	formatSubmissionAddress,
	isAppealSubmission,
	isV2Submission
};
