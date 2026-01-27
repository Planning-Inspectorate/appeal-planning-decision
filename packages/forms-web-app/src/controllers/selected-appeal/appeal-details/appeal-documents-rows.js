const { formatDocumentDetails } = require('@pins/common');
const { CASE_TYPES } = require('@pins/common/src/database/data-static');

const {
	APPEAL_DOCUMENT_TYPE,
	APPEAL_APPELLANT_PROCEDURE_PREFERENCE
} = require('@planning-inspectorate/data-model');

/**
 * @typedef {import('appeals-service-api').Api.AppealCaseDetailed} AppealCaseDetailed
 * @typedef {import("@pins/common/src/view-model-maps/rows/def").Rows} Rows
 */

/**
 * @param {AppealCaseDetailed} caseData
 * @returns {Rows}
 */
exports.documentsRows = (caseData) => {
	if (
		caseData.appealTypeCode === CASE_TYPES.ENFORCEMENT.processCode ||
		caseData.appealTypeCode === CASE_TYPES.ENFORCEMENT_LISTED.processCode
	)
		return enforcementDocumentsRows(caseData);

	const documents = caseData.Documents || [];

	const isS20orS78 =
		caseData.appealTypeCode === CASE_TYPES.S20.processCode ||
		caseData.appealTypeCode === CASE_TYPES.S78.processCode;
	const isAdvertAppeal =
		caseData.appealTypeCode === CASE_TYPES.CAS_ADVERTS.processCode ||
		caseData.appealTypeCode === CASE_TYPES.ADVERTS.processCode;
	const isLDC = caseData.appealTypeCode === CASE_TYPES.LDC.processCode;

	return [
		{
			keyText: 'Application form',
			valueText: formatDocumentDetails(documents, APPEAL_DOCUMENT_TYPE.ORIGINAL_APPLICATION_FORM),
			condition: () => true,
			isEscaped: true
		},
		{
			keyText: 'Plans, drawings and supporting documents',
			valueText: formatDocumentDetails(documents, APPEAL_DOCUMENT_TYPE.PLANS_DRAWINGS),
			condition: () => caseData.appealTypeCode !== CASE_TYPES.HAS.processCode, // in lpaq for HAS
			isEscaped: true
		},
		{
			keyText: 'Separate ownership certificate in application',
			valueText: formatDocumentDetails(documents, APPEAL_DOCUMENT_TYPE.OWNERSHIP_CERTIFICATE),
			condition: () => isS20orS78,
			isEscaped: true
		},
		{
			keyText: 'Design and access statement in application',
			valueText: formatDocumentDetails(documents, APPEAL_DOCUMENT_TYPE.DESIGN_ACCESS_STATEMENT),
			condition: () =>
				isS20orS78 || caseData.appealTypeCode === CASE_TYPES.CAS_PLANNING.processCode,
			isEscaped: true
		},
		{
			keyText: 'Decision letter',
			valueText: formatDocumentDetails(documents, APPEAL_DOCUMENT_TYPE.APPLICATION_DECISION_LETTER),
			condition: () => true,
			isEscaped: true
		},
		{
			keyText: 'Appeal statement',
			valueText: formatDocumentDetails(documents, APPEAL_DOCUMENT_TYPE.APPELLANT_STATEMENT),
			condition: () => true,
			isEscaped: true
		},
		{
			keyText: 'New plans or drawings',
			valueText: formatDocumentDetails(documents, APPEAL_DOCUMENT_TYPE.NEW_PLANS_DRAWINGS),
			condition: () => isS20orS78 || isLDC,
			isEscaped: true
		},
		{
			keyText: 'Planning obligation status',
			valueText: caseData.statusPlanningObligation,
			condition: (caseData) => (isS20orS78 || isLDC) && caseData.statusPlanningObligation
		},
		{
			keyText: 'Planning obligation',
			valueText: formatDocumentDetails(documents, APPEAL_DOCUMENT_TYPE.PLANNING_OBLIGATION),
			condition: () => isS20orS78 || isLDC,
			isEscaped: true
		},
		{
			keyText: 'New supporting documents',
			valueText: formatDocumentDetails(documents, APPEAL_DOCUMENT_TYPE.OTHER_NEW_DOCUMENTS),
			condition: () => isS20orS78 || isLDC,
			isEscaped: true
		},
		{
			keyText: 'Draft statement of common ground',
			valueText: formatDocumentDetails(documents, APPEAL_DOCUMENT_TYPE.STATEMENT_COMMON_GROUND),
			condition: () =>
				(isS20orS78 || isLDC) &&
				caseData.appellantProcedurePreference !== APPEAL_APPELLANT_PROCEDURE_PREFERENCE.WRITTEN,
			isEscaped: true
		},
		{
			keyText: isAdvertAppeal
				? 'Upload the evidence of your agreement to change the description of the advertisement'
				: 'Evidence of agreement to change description of development',
			valueText: formatDocumentDetails(documents, APPEAL_DOCUMENT_TYPE.CHANGED_DESCRIPTION),
			condition: (caseData) => !!caseData.changedDevelopmentDescription,
			isEscaped: true
		},
		{
			keyText: 'Costs application',
			valueText: formatDocumentDetails(documents, APPEAL_DOCUMENT_TYPE.APPELLANT_COSTS_APPLICATION),
			condition: (caseData) => caseData.appellantCostsAppliedFor,
			isEscaped: true
		}
	];
};

/**
 * @param {AppealCaseDetailed} caseData
 * @returns {Rows}
 */
const enforcementDocumentsRows = (caseData) => {
	const documents = caseData.Documents || [];

	return [
		{
			keyText: 'Communication with Planning Inspectorate',
			valueText: formatDocumentDetails(
				documents,
				APPEAL_DOCUMENT_TYPE.PRIOR_CORRESPONDENCE_WITH_PINS
			),
			condition: (caseData) => !!caseData.contactPlanningInspectorateDate,
			isEscaped: true
		},
		{
			keyText: 'Enforcement notice',
			valueText: formatDocumentDetails(documents, APPEAL_DOCUMENT_TYPE.ENFORCEMENT_NOTICE),
			condition: () => true,
			isEscaped: true
		},
		{
			keyText: 'Enforcement notice plan',
			valueText: formatDocumentDetails(documents, APPEAL_DOCUMENT_TYPE.ENFORCEMENT_NOTICE_PLAN),
			condition: () => true,
			isEscaped: true
		},
		{
			keyText: 'Application form',
			valueText: formatDocumentDetails(documents, APPEAL_DOCUMENT_TYPE.ORIGINAL_APPLICATION_FORM),
			condition: (caseData) => !!caseData.applicationMadeAndFeePaid,
			isEscaped: true
		},
		{
			keyText: 'Evidence of agreement to change description of development',
			valueText: formatDocumentDetails(documents, APPEAL_DOCUMENT_TYPE.CHANGED_DESCRIPTION),
			condition: (caseData) => !!caseData.changedDevelopmentDescription,
			isEscaped: true
		},
		{
			keyText: 'Decision letter',
			valueText: formatDocumentDetails(documents, APPEAL_DOCUMENT_TYPE.APPLICATION_DECISION_LETTER),
			condition: (caseData) => !!caseData.applicationMadeAndFeePaid,
			isEscaped: true
		},
		{
			keyText: 'Planning obligation status',
			valueText: caseData.statusPlanningObligation,
			condition: (caseData) => !!caseData.statusPlanningObligation
		},
		{
			keyText: 'Planning obligation',
			valueText: formatDocumentDetails(documents, APPEAL_DOCUMENT_TYPE.PLANNING_OBLIGATION),
			condition: () => !!caseData.applicationMadeAndFeePaid,
			isEscaped: true
		},
		{
			keyText: 'Costs application',
			valueText: formatDocumentDetails(documents, APPEAL_DOCUMENT_TYPE.APPELLANT_COSTS_APPLICATION),
			condition: (caseData) => !!caseData.appellantCostsAppliedFor,
			isEscaped: true
		},
		{
			keyText: 'New supporting documents',
			valueText: formatDocumentDetails(documents, APPEAL_DOCUMENT_TYPE.OTHER_NEW_DOCUMENTS),
			condition: () => true,
			isEscaped: true
		}
	];
};
