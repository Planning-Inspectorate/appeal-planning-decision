const { LPA_USER_ROLE } = require('@pins/common/src/constants');

// General
/**
 * @param {string} userType
 * @returns {string}
 */
const formatTitleSuffix = (userType) => {
	if (userType === LPA_USER_ROLE) return 'Manage your appeals';
	return 'Appeal a planning decision';
};

//Questionnaire
/**
 * @param {string} userType
 * @returns {string}
 */
const formatQuestionnaireHeading = (userType) => {
	if (userType === LPA_USER_ROLE) return 'Questionnaire';
	return 'Local planning authority questionnaire';
};

//Final Comments
/**
 * @param {string} url
 * @returns {string}
 */
const formatFinalCommentsHeadingPrefix = (url) => {
	switch (true) {
		case url.includes('/lpa-final-comments'):
			return 'Local planning authority';
		case url.includes('/appellant-final-comments'):
			return `Appellant's`;
		default:
			return 'Your';
	}
};

/**
 * @param {string} url
 * @param {string} userType
 * @returns {boolean}
 */
const isAppellantComments = (url, userType) => {
	return (
		url.includes('/appellant-final-comments') ||
		(url.includes('/final-comments') && userType !== LPA_USER_ROLE)
	);
};

/**
 * @param {import('appeals-service-api').Api.AppealCaseWithRule6Parties} caseData
 * @param {boolean} isAppellantComments
 */
const getFinalComments = (caseData, isAppellantComments) => {
	return isAppellantComments
		? caseData.appellantFinalCommentDetails
		: caseData.lpaFinalCommentDetails;
};

//Statements
/**
 * @param {string} userType
 * @returns {string}
 */
const formatStatementHeading = (userType) => {
	if (userType === LPA_USER_ROLE) return 'Your';
	return 'Local planning authority';
};

module.exports = {
	formatTitleSuffix,
	formatQuestionnaireHeading,
	formatFinalCommentsHeadingPrefix,
	isAppellantComments,
	getFinalComments,
	formatStatementHeading
};
