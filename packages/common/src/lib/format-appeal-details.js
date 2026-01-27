const escape = require('escape-html');
const { APPEAL_USER_ROLES } = require('../constants');
const {
	APPEAL_DEVELOPMENT_TYPE,
	APPEAL_APPEAL_UNDER_ACT_SECTION
} = require('@planning-inspectorate/data-model');
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

	const { firstName, lastName, organisation } = contact;

	if (!firstName && !lastName && organisation) return escape(`${organisation}`);

	const contactName = escape(`${firstName} ${lastName}`);

	return contactName + (organisation ? `\n${organisation}` : '');
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
 * @param {import("../client/appeals-api-client").AppealCaseDetailed['developmentType']} developmentType
 * @returns {string}
 */
exports.formatMajorMinorDevelopmentType = (developmentType) => {
	if (!developmentType) return '';

	switch (developmentType) {
		case APPEAL_DEVELOPMENT_TYPE.HOUSEHOLDER:
		case APPEAL_DEVELOPMENT_TYPE.CHANGE_OF_USE:
		case APPEAL_DEVELOPMENT_TYPE.MINERAL_WORKINGS:
			return '';

		case APPEAL_DEVELOPMENT_TYPE.MAJOR_DWELLINGS:
		case APPEAL_DEVELOPMENT_TYPE.MAJOR_INDUSTRY_STORAGE:
		case APPEAL_DEVELOPMENT_TYPE.MAJOR_OFFICES:
		case APPEAL_DEVELOPMENT_TYPE.MAJOR_RETAIL_SERVICES:
		case APPEAL_DEVELOPMENT_TYPE.MAJOR_TRAVELLER_CARAVAN:
		case APPEAL_DEVELOPMENT_TYPE.OTHER_MAJOR:
			return 'Major';

		case APPEAL_DEVELOPMENT_TYPE.MINOR_DWELLINGS:
		case APPEAL_DEVELOPMENT_TYPE.MINOR_INDUSTRY_STORAGE:
		case APPEAL_DEVELOPMENT_TYPE.MINOR_OFFICES:
		case APPEAL_DEVELOPMENT_TYPE.MINOR_RETAIL_SERVICES:
		case APPEAL_DEVELOPMENT_TYPE.MINOR_TRAVELLER_CARAVAN:
		case APPEAL_DEVELOPMENT_TYPE.OTHER_MINOR:
			return 'Minor';
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
 * @param {import("../client/appeals-api-client").AppealCaseDetailed} caseData
 * @param {string} ground
 */
exports.formatFactsForGround = (caseData, ground) => {
	const relevantGroundDetails = caseData.EnforcementAppealGroundDetails?.find(
		(groundDetails) => groundDetails.appealGroundLetter === ground
	);

	if (!relevantGroundDetails?.groundFacts) return '';

	return escape(relevantGroundDetails.groundFacts);
};

/**
 * @param {import("../client/appeals-api-client").AppealCaseDetailed} caseData
 * @param {string} ground
 */
exports.hasAppealGround = (caseData, ground) => {
	return caseData.EnforcementAppealGroundDetails?.some(
		(groundDetails) => groundDetails.appealGroundLetter === ground
	);
};

/**
 * @param {import("../client/appeals-api-client").AppealCaseDetailed['EnforcementAppealGroundsDetails']} grounds
 */
exports.formatGroundsOfAppeal = (grounds) => {
	return grounds
		.sort((a, b) => a.appealGroundLetter.localeCompare(b.appealGroundLetter))
		.map((groundDetails) => `Ground (${groundDetails.appealGroundLetter})`)
		.join('\n');
};

/**
 * @param {import("../client/appeals-api-client").AppealCaseDetailed} caseData
 */
exports.formatAllOrPart = (caseData) => {
	const { applicationPartOrWholeDevelopment } = caseData;

	switch (applicationPartOrWholeDevelopment) {
		case 'part-of-the-development':
			return 'Part of the development';
		case 'all-of-the-development':
			return 'All of the development';
		default:
			return '';
	}
};

/**
 * @param {import("../client/appeals-api-client").AppealCaseDetailed} caseData
 */
exports.formatInterestInLand = (caseData) => {
	const { ownerOccupancyStatus, occupancyConditionsMet } = caseData;

	const interestInLand = ownerOccupancyStatus ?? '';

	const interests = ['Owner', 'Tenant', 'MortgageLender'];

	const hasPermission = interests.includes(interestInLand) ? null : !!occupancyConditionsMet;

	return {
		interestInLand,
		hasPermission
	};
};

/**
 * @param {import("../client/appeals-api-client").AppealCaseDetailed} caseData
 * @param {'applicationMadeUnderActSection'|'appealUnderActSection'} field
 * @returns {string}
 */
exports.formatActSection = (caseData, field) => {
	const answer = caseData[field];

	if (!answer) return '';

	switch (answer) {
		case APPEAL_APPEAL_UNDER_ACT_SECTION.EXISTING_DEVELOPMENT:
			return 'Existing development';
		case APPEAL_APPEAL_UNDER_ACT_SECTION.PROPOSED_CHANGES_TO_A_LISTED_BUILDING:
			return 'Proposed changes to a listed building';
		case APPEAL_APPEAL_UNDER_ACT_SECTION.PROPOSED_USE_OF_A_DEVELOPMENT:
			return 'Proposed use of a development';
		default:
			return answer;
	}
};

/**
 * this can't be a hyperlink unless we check it exists in FO first, or as per back office we link to external site via ref
 * @param {import('appeals-service-api').Api.AppealCaseRelationship} linkedAppeal
 */
// const formatRelatedAppealHyperlink = (linkedAppeal) => {
// 	return `<a href=# class="govuk-link">${escape(linkedAppeal.caseReference2)}</a>`;
// };
