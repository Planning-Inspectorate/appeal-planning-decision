const {
	APPEAL_DOCUMENT_TYPE,
	APPEAL_LPA_QUESTIONNAIRE_VALIDATION_OUTCOME
} = require('@planning-inspectorate/data-model');
const { formatDocumentsAsNumberedList, documentExists } = require('@pins/common');
const { LPA_USER_ROLE, APPEAL_USER_ROLES } = require('@pins/common/src/constants');

/**
 * @param {{ caseData: import('appeals-service-api').Api.AppealCaseDetailed, userType: string }} params
 * @returns {import("@pins/common/src/view-model-maps/rows/def").Rows}
 */
exports.additionalDocumentsRows = ({ caseData, userType }) => {
	const documents = caseData.Documents || [];
	if ([LPA_USER_ROLE, APPEAL_USER_ROLES.APPELLANT].includes(/** @type {any} */ (userType))) {
		return [
			{
				keyText: 'Additional documents',
				valueText: formatDocumentsAsNumberedList(
					documents,
					APPEAL_DOCUMENT_TYPE.LPA_CASE_CORRESPONDENCE
				),
				condition: (/** @type {import('appeals-service-api').Api.AppealCaseDetailed} */ caseData) =>
					documentExists(documents, APPEAL_DOCUMENT_TYPE.LPA_CASE_CORRESPONDENCE) &&
					caseData?.lpaQuestionnaireValidationOutcome ===
						APPEAL_LPA_QUESTIONNAIRE_VALIDATION_OUTCOME.COMPLETE,
				isEscaped: true
			}
		];
	}
	return [];
};
