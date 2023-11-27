const extractAppealNumber = (caseReference) => {
	return caseReference.split('/').pop();
};

const formatAddress = (appealCaseData) => {
	if (appealCaseData.siteAddressLine2) {
		return `${appealCaseData.siteAddressLine1}, ${appealCaseData.siteAddressLine2}, ${appealCaseData.siteAddressTown}, ${appealCaseData.siteAddressPostcode}`;
	}

	return `${appealCaseData.siteAddressLine1}, ${appealCaseData.siteAddressTown}, ${appealCaseData.siteAddressPostcode}`;
};

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
