const { formatDocumentDetails, documentExists } = require('@pins/common');
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
	const documents = caseData.Documents || [];

	const isS20orS78 =
		caseData.appealTypeCode === CASE_TYPES.S20.processCode ||
		caseData.appealTypeCode === CASE_TYPES.S78.processCode;
	const isAdvertAppeal =
		caseData.appealTypeCode === CASE_TYPES.CAS_ADVERTS.processCode ||
		caseData.appealTypeCode === CASE_TYPES.ADVERTS.processCode;

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
			condition: () => isS20orS78,
			isEscaped: true
		},
		{
			keyText: 'Planning obligation status',
			valueText: caseData.statusPlanningObligation,
			condition: (caseData) => isS20orS78 && caseData.statusPlanningObligation
		},
		{
			keyText: 'Planning obligation',
			valueText: formatDocumentDetails(documents, APPEAL_DOCUMENT_TYPE.PLANNING_OBLIGATION),
			condition: () => isS20orS78,
			isEscaped: true
		},
		{
			keyText: 'New supporting documents',
			valueText: formatDocumentDetails(documents, APPEAL_DOCUMENT_TYPE.OTHER_NEW_DOCUMENTS),
			condition: () => isS20orS78,
			isEscaped: true
		},
		{
			keyText: 'Draft statement of common ground',
			valueText: formatDocumentDetails(documents, APPEAL_DOCUMENT_TYPE.STATEMENT_COMMON_GROUND),
			condition: () =>
				isS20orS78 &&
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
		},
		{
			keyText: 'Additional documents',
			valueText: formatDocumentDetails(
				documents,
				APPEAL_DOCUMENT_TYPE.APPELLANT_CASE_CORRESPONDENCE
			),
			condition: () =>
				documentExists(documents, APPEAL_DOCUMENT_TYPE.APPELLANT_CASE_CORRESPONDENCE),
			isEscaped: true
		}
	];
};
