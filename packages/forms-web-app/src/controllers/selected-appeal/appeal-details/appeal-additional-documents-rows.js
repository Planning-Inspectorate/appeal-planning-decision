const { APPEAL_DOCUMENT_TYPE } = require('@planning-inspectorate/data-model');
const { documentExists, formatDocumentsAsNumberedList } = require('@pins/common');
const { LPA_USER_ROLE, APPEAL_USER_ROLES } = require('@pins/common/src/constants');

/**
 * @param {{ caseData: import('appeals-service-api').Api.AppealCaseDetailed, userType: string }} params
 * @returns {import("@pins/common/src/view-model-maps/rows/def").Rows}
 */
exports.appealAdditionalDocumentsRows = ({ caseData, userType }) => {
	const documents = caseData.Documents || [];
	if ([LPA_USER_ROLE, APPEAL_USER_ROLES.APPELLANT].includes(/** @type {any} */ (userType))) {
		return [
			{
				keyText: 'Additional documents',
				valueText: formatDocumentsAsNumberedList(
					documents,
					APPEAL_DOCUMENT_TYPE.APPELLANT_CASE_CORRESPONDENCE
				),
				condition: (/** @type {import('appeals-service-api').Api.AppealCaseDetailed} */ caseData) =>
					documentExists(documents, APPEAL_DOCUMENT_TYPE.APPELLANT_CASE_CORRESPONDENCE) &&
					!!caseData?.caseValidationOutcome,
				isEscaped: true
			}
		];
	}
	return [];
};
