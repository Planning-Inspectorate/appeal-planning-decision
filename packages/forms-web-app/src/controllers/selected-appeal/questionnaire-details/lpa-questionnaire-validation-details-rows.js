const {
	APPEAL_DOCUMENT_TYPE,
	APPEAL_LPA_QUESTIONNAIRE_VALIDATION_OUTCOME
} = require('@planning-inspectorate/data-model');
const { formatDocumentLink } = require('@pins/common');
const { LPA_USER_ROLE, APPEAL_USER_ROLES } = require('@pins/common/src/constants');

/**
 * @param {{ caseData: import('appeals-service-api').Api.AppealCaseDetailed, userType: string }} params
 * @returns {import("@pins/common/src/view-model-maps/rows/def").Rows}
 */
exports.lpaQuestionnaireValidationRows = ({ caseData, userType }) => {
	const documents = caseData.Documents || [];
	if ([LPA_USER_ROLE, APPEAL_USER_ROLES.APPELLANT].includes(/** @type {any} */ (userType))) {
		return formatLPAQuestionnaireValidationRows(documents);
	}
	return [];
};

/**
 * @param {import('appeals-service-api').Api.Document[]} documents
 */
const formatLPAQuestionnaireValidationRows = (documents) => {
	const lpaQuestionnaireValidationDocs = documents.filter(
		(doc) => doc.documentType === APPEAL_DOCUMENT_TYPE.LPA_CASE_CORRESPONDENCE
	);

	if (lpaQuestionnaireValidationDocs.length === 1) {
		return [
			{
				keyText: '',
				valueText: formatDocumentLink(lpaQuestionnaireValidationDocs[0]),
				condition: (/** @type {import('appeals-service-api').Api.AppealCaseDetailed} */ caseData) =>
					caseData?.lpaQuestionnaireValidationOutcome ===
					APPEAL_LPA_QUESTIONNAIRE_VALIDATION_OUTCOME.COMPLETE,
				isEscaped: true
			}
		];
	} else if (lpaQuestionnaireValidationDocs.length > 1) {
		return [
			{
				keyText: '',
				valueText: formatDocumentsAsBulletedList(lpaQuestionnaireValidationDocs),
				condition: (/** @type {import('appeals-service-api').Api.AppealCaseDetailed} */ caseData) =>
					caseData?.lpaQuestionnaireValidationOutcome ===
					APPEAL_LPA_QUESTIONNAIRE_VALIDATION_OUTCOME.COMPLETE,
				isEscaped: true
			}
		];
	}
	return [];
};

/**
 * @param {import('appeals-service-api').Api.Document[]} documents
 * returns {string}
 */
const formatDocumentsAsBulletedList = (documents) => {
	let listHtml = '<ul>';
	documents.forEach((document) => {
		listHtml += `<li>${formatDocumentLink(document)}</li>`;
	});
	listHtml += '</ul>';
	return listHtml;
};
