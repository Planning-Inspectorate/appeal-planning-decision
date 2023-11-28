/**
 * @typedef AppealType
 * @type {object}
 * @property {string} long a longer form appeal type string, for appellants
 * @property {string} short a shorter form appeal type string, for lpa users
 */

/**
 * @param {string} caseReference
 * @returns {string} returns the seven digit appeal number as a string string
 */
const extractAppealNumber = (caseReference) => {
	return caseReference.split('/').pop();
};

const formatAddress = (appealCaseData) => {
	if (appealCaseData.siteAddressLine2) {
		return `${appealCaseData.siteAddressLine1}, ${appealCaseData.siteAddressLine2}, ${appealCaseData.siteAddressTown}, ${appealCaseData.siteAddressPostcode}`;
	}

	return `${appealCaseData.siteAddressLine1}, ${appealCaseData.siteAddressTown}, ${appealCaseData.siteAddressPostcode}`;
};

/**
 * @param {string} caseDataAppealType
 * @returns {AppealType} returns an object with a long and a short appealType string
 */
const formatAppealType = (caseDataAppealType) => {
	if (caseDataAppealType === 'Householder (HAS) Appeal') {
		return {
			long: 'Householder',
			short: 'HAS'
		};
	} else if (caseDataAppealType === 'Full Planning (S78) Appeal') {
		return {
			long: 'Full planning',
			short: 'S78'
		};
	}
};

module.exports = {
	extractAppealNumber,
	formatAddress,
	formatAppealType
};
