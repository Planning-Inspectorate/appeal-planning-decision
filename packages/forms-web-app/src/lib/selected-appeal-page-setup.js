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

/**
 * @param {string} userType
 * @returns {string}
 */
const determineServicePage = (userType) => {
	if (userType === LPA_USER_ROLE) return 'layouts/lpa-dashboard/main.njk';
	return 'layouts/no-banner-link/main.njk';
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

module.exports = {
	formatTitleSuffix,
	formatQuestionnaireHeading,
	determineServicePage
};
