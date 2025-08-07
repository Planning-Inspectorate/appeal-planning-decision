/**
 * @typedef {import("appeals-service-api").Api.ServiceUser} ServiceUser
 * @typedef {import('@pins/common/src/constants').AppealToUserRoles} AppealToUserRoles
 * @typedef {import('@pins/common/src/constants').LpaUserRole} LpaUserRole
 */

/**
 * @typedef {Object} formattedLinkedCases
 * @property {string} html
 */

const { APPEAL_USER_ROLES, LPA_USER_ROLE } = require('../constants');

const urlStubDict = {
	[APPEAL_USER_ROLES.APPELLANT]: 'appeals',
	[APPEAL_USER_ROLES.AGENT]: 'appeals',
	[LPA_USER_ROLE]: 'manage-appeals',
	[APPEAL_USER_ROLES.RULE_6_PARTY]: 'rule-6'
};

/**
 * @param {{childCaseReference: string, leadCaseReference: string}[]} linkedCases
 * @param {string} appealCaseReference
 * @param {AppealToUserRoles|LpaUserRole|null} userType
 * @returns {formattedLinkedCases}
 */
const formatLinkedCases = (linkedCases, appealCaseReference, userType) => {
	if (!userType || !linkedCases || !linkedCases.length) return { html: 'No linked cases' };
	const urlStub = urlStubDict[userType];

	const leadCaseReference = linkedCases[0].leadCaseReference;

	if (leadCaseReference !== appealCaseReference) {
		return { html: `${linkedCaseHtml(leadCaseReference, urlStub)} (lead)` };
	}

	return {
		html: linkedCases
			.map((linkedCase) => linkedCaseHtml(linkedCase.childCaseReference, urlStub))
			.join('<br>')
	};
};

/**
 * @param {string} linkedCaseReference // the case reference of the linked case
 * @param {string} urlStub // ie appeals/manage-appeals/rule-6
 * @returns {string}
 */
const linkedCaseHtml = (linkedCaseReference, urlStub) => {
	return `<a href="/${urlStub}/${linkedCaseReference}" class="govuk-link">${linkedCaseReference}</a>`;
};

module.exports = {
	formatLinkedCases
};
