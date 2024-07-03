const escape = require('escape-html');

// NOTE - consider requirement to escape string values from caseData

/**
 * todo: consts for roles
 * @param {import("../client/appeals-api-client").AppealCaseDetailed} caseData
 * @returns {string}
 */
exports.formatContactDetails = (caseData) => {
	let contact = caseData.users?.find((x) => {
		x.role === 'Agent';
	});

	if (!contact) {
		contact = caseData.users?.find((x) => {
			x.role === 'Appellant';
		});
	}

	if (!contact) return '';

	return formatUserDetails(contact);
};

/**
 * @param {import("../client/appeals-api-client").AppealCaseDetailed} caseData
 * @returns {string}
 */
exports.formatApplicantDetails = (caseData) => {
	const contact = caseData.users?.find((x) => {
		x.role === 'Appellant';
	});

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
 */
exports.formatAccessDetails = (caseData) => {
	if (!caseData.siteAccessDetails) {
		return 'No';
	}

	const details = caseData.siteAccessDetails.map((x) => x).join('\n');

	return `Yes \n ${details}`;
};

/**
 * @param {import("../client/appeals-api-client").AppealCaseDetailed} caseData
 */
exports.formatHealthAndSafety = (caseData) => {
	if (!caseData.siteSafetyDetails) return 'No';

	const details = caseData.siteSafetyDetails.map((x) => x).join('\n');

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
 * this can't be a hyperlink unless we check it exists in FO first
 * @param {import('appeals-service-api').Api.AppealCaseRelationship} linkedAppeal
 */
// const formatRelatedAppealHyperlink = (linkedAppeal) => {
// 	return `<a href=# class="govuk-link">${escape(linkedAppeal.caseReference2)}</a>`;
// };
