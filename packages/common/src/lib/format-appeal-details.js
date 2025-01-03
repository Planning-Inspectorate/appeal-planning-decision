const escape = require('escape-html');
const { APPEAL_USER_ROLES } = require('../constants');

// NOTE - consider requirement to escape string values from caseData

/**
 * @param {import("../client/appeals-api-client").AppealCaseDetailed} caseData
 * @returns {string}
 */
exports.formatContactDetails = (caseData) => {
	let contact = caseData.users?.find((x) => {
		x.role === APPEAL_USER_ROLES.AGENT;
	});

	if (!contact) {
		contact = caseData.users?.find((x) => {
			x.role === APPEAL_USER_ROLES.APPELLANT;
		});
	}

	if (!contact) return '';

	return formatUserDetails(contact);
};

/**
 * @param {import('appeals-service-api').Api.ServiceUser} [contact]
 * @returns {string}
 */
function formatUserDetails(contact) {
	if (!contact) return '';

	const contactName = escape(`${contact.firstName} ${contact.lastName}`);

	return contactName + (contact.organisation ? `\n${contact.organisation}` : '');
}
exports.formatUserDetails = formatUserDetails;

/**
 * @param {import("../client/appeals-api-client").AppealCaseDetailed} caseData
 * @returns {string} site access details provided by Appellant
 */
exports.formatAccessDetails = (caseData) => {
	if (!caseData.siteAccessDetails || !caseData.siteAccessDetails[0]) {
		return 'No';
	}

	const details = caseData.siteAccessDetails[0];

	return `Yes \n ${details}`;
};

/**
 * @param {import("../client/appeals-api-client").AppealCaseDetailed} caseData
 * @returns {string} safety details provided by Appellant
 */
exports.formatHealthAndSafety = (caseData) => {
	if (!caseData.siteSafetyDetails || !caseData.siteSafetyDetails[0]) return 'No';

	const details = caseData.siteSafetyDetails[0];

	return `Yes \n ${details}`;
};

/**
 * @param {import("../client/appeals-api-client").AppealCaseDetailed} caseData
 */
exports.formatProcedure = (caseData) => {
	const possibleProcedures = [
		caseData.appellantProcedurePreference ?? '',
		caseData.appellantProcedurePreferenceDetails ?? ''
	];

	const valueText = possibleProcedures.filter(Boolean).join('\n');

	return valueText;
};

/**
 * @param {import("../client/appeals-api-client").AppealCaseDetailed} caseData
 * @param {'linked'| 'nearby'} type
 */
exports.formatRelatedAppeals = (caseData, type) => {
	const appellantLinkedCases = caseData.relations?.filter((relation) => relation.type === type);

	if (!appellantLinkedCases?.length) return '';

	return appellantLinkedCases.map((linkedAppeal) => escape(linkedAppeal.caseReference2)).join('\n');
};

/**
 * this can't be a hyperlink unless we check it exists in FO first, or as per back office we link to external site via ref
 * @param {import('appeals-service-api').Api.AppealCaseRelationship} linkedAppeal
 */
// const formatRelatedAppealHyperlink = (linkedAppeal) => {
// 	return `<a href=# class="govuk-link">${escape(linkedAppeal.caseReference2)}</a>`;
// };
