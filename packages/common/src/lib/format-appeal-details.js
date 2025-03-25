const escape = require('escape-html');
const { APPEAL_USER_ROLES } = require('../constants');
const { APPEAL_DEVELOPMENT_TYPE } = require('pins-data-model');
const { formatDateForDisplay } = require('./format-date');

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
 * @param {import("../client/appeals-api-client").AppealCaseDetailed} caseData
 * @param {import('../dynamic-forms/field-names').DynamicFormFieldName} type
 */
exports.formatSubmissionRelatedAppeals = (caseData, type) => {
	const appellantLinkedCases = caseData.submissionLinkedCases?.filter(
		(relation) => relation.fieldName === type
	);

	if (!appellantLinkedCases?.length) return '';

	return appellantLinkedCases.map((linkedAppeal) => escape(linkedAppeal.caseReference)).join('\n');
};

/**
 * @param {import("../client/appeals-api-client").AppealCaseDetailed['developmentType']} developmentType
 * @returns {string}
 */
exports.formatDevelopmentType = (developmentType) => {
	if (!developmentType) return '';

	switch (developmentType) {
		case APPEAL_DEVELOPMENT_TYPE.HOUSEHOLDER:
			return 'Householder development';
		case APPEAL_DEVELOPMENT_TYPE.CHANGE_OF_USE:
			return 'Change of use';
		case APPEAL_DEVELOPMENT_TYPE.MINERAL_WORKINGS:
			return 'Mineral workings';

		case APPEAL_DEVELOPMENT_TYPE.OTHER_MAJOR:
			return 'Other major development';
		case APPEAL_DEVELOPMENT_TYPE.OTHER_MINOR:
			return 'Other minor development';

		case APPEAL_DEVELOPMENT_TYPE.MAJOR_DWELLINGS:
			return 'Major dwellings';
		case APPEAL_DEVELOPMENT_TYPE.MAJOR_INDUSTRY_STORAGE:
			return 'Major general industry, storage or warehousing';
		case APPEAL_DEVELOPMENT_TYPE.MAJOR_OFFICES:
			return 'Major offices, light industry or research and development';
		case APPEAL_DEVELOPMENT_TYPE.MAJOR_RETAIL_SERVICES:
			return 'Major retail and services';
		case APPEAL_DEVELOPMENT_TYPE.MAJOR_TRAVELLER_CARAVAN:
			return 'Major traveller and caravan pitches';

		case APPEAL_DEVELOPMENT_TYPE.MINOR_DWELLINGS:
			return 'Minor dwellings';
		case APPEAL_DEVELOPMENT_TYPE.MINOR_INDUSTRY_STORAGE:
			return 'Minor general industry, storage or warehousing';
		case APPEAL_DEVELOPMENT_TYPE.MINOR_OFFICES:
			return 'Minor offices, light industry or research and development';
		case APPEAL_DEVELOPMENT_TYPE.MINOR_RETAIL_SERVICES:
			return 'Minor retail and services';
		case APPEAL_DEVELOPMENT_TYPE.MINOR_TRAVELLER_CARAVAN:
			return 'Minor traveller and caravan pitches';
	}

	throw new Error('unhandled developmentType mapping');
};

/**
 * @param {string} submission
 * @param {Date|string|undefined} date
 * @returns {string}
 */
exports.formatSubmissionDate = (submission, date) => {
	return `${submission} submitted on ${formatDateForDisplay(date)}`;
};

/**
 * this can't be a hyperlink unless we check it exists in FO first, or as per back office we link to external site via ref
 * @param {import('appeals-service-api').Api.AppealCaseRelationship} linkedAppeal
 */
// const formatRelatedAppealHyperlink = (linkedAppeal) => {
// 	return `<a href=# class="govuk-link">${escape(linkedAppeal.caseReference2)}</a>`;
// };
