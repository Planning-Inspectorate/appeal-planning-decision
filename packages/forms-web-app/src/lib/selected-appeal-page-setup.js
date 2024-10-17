const { LPA_USER_ROLE, APPEAL_USER_ROLES, STATEMENT_TYPE } = require('@pins/common/src/constants');

/**
 * @typedef {import('appeals-service-api').Api.AppealUser} AppealUser
 */

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
 * @param {AppealUser} user
 * @param {string} userType
 * @returns {string}
 */
const getFinalCommentUserGroup = (url, user, userType) => {
	if (url.includes('other-party-final-comments')) {
		// cant see the copy deck for this
		return APPEAL_USER_ROLES.RULE_6_PARTY;
	} else if (url.includes('lpa-final-comments')) {
		return LPA_USER_ROLE;
	} else if (user.lpaCode && url.includes('final-comments')) {
		return LPA_USER_ROLE;
	} else if (
		user.serviceUserId &&
		userType === APPEAL_USER_ROLES.APPELLANT &&
		url.includes('final-comments')
	) {
		return APPEAL_USER_ROLES.APPELLANT;
	} else if (
		user.serviceUserId &&
		userType === APPEAL_USER_ROLES.RULE_6_PARTY &&
		url.includes('final-comments') // cant see the copy deck for this
	) {
		return APPEAL_USER_ROLES.RULE_6_PARTY;
	} else {
		throw new Error('Unable to determine final comment type');
	}
};

//Statements
/**
 * @param {string} url
 * @returns {string}
 */
const formatStatementHeading = (url) => {
	if (url.includes('other-party-statements')) {
		return 'Statements from other parties';
	} else if (url.includes('lpa-statement')) {
		return 'Local planning authority statement';
	} else {
		return 'Your statement';
	}
};

/**
 * @param {string} url
 * @param {AppealUser} user
 * @param {string} userType
 * @returns {string}
 */
const getStatementType = (url, user, userType) => {
	if (url.includes('other-party-statements')) {
		return STATEMENT_TYPE.RULE_6;
	} else if (url.includes('lpa-statement')) {
		return STATEMENT_TYPE.LPA;
	} else if (user.lpaCode && url.includes('statement')) {
		return STATEMENT_TYPE.LPA;
	} else if (
		user.serviceUserId &&
		userType === APPEAL_USER_ROLES.RULE_6_PARTY &&
		url.includes('statement')
	) {
		return STATEMENT_TYPE.RULE_6;
	} else {
		throw new Error('Unable to determine statement type');
	}
};

// Planning obligation
/**
 * @param {string} userType
 * @returns {string}
 */
const formatPlanningObligationTitlePrefix = (userType) => {
	if (userType !== APPEAL_USER_ROLES.APPELLANT) return 'Appellant';
	return 'Your';
};

module.exports = {
	formatTitleSuffix,
	formatQuestionnaireHeading,
	formatFinalCommentsHeadingPrefix,
	getFinalCommentUserGroup,
	formatStatementHeading,
	getStatementType,
	formatPlanningObligationTitlePrefix
};
