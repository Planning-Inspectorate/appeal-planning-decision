const {
	formatNotificationMethod,
	hasNotificationMethods,
	formatDocumentDetails,
	documentExists
} = require('@pins/common');
const { APPEAL_DOCUMENT_TYPE } = require('@planning-inspectorate/data-model');

/**
 * @param {import('appeals-service-api').Api.AppealCaseDetailed } caseData
 * @returns {import("@pins/common/src/view-model-maps/rows/def").Rows}
 */
exports.notifiedRows = (caseData) => {
	const documents = caseData.Documents || [];
	return [
		{
			keyText: 'Who was notified',
			valueText: formatDocumentDetails(documents, APPEAL_DOCUMENT_TYPE.WHO_NOTIFIED),
			condition: () => documentExists(documents, APPEAL_DOCUMENT_TYPE.WHO_NOTIFIED),
			isEscaped: true
		},
		{
			keyText: 'Type of Notification',
			valueText: formatNotificationMethod(caseData) || '',
			condition: () => hasNotificationMethods(caseData)
		},
		{
			keyText: 'Site notice',
			valueText: formatDocumentDetails(documents, APPEAL_DOCUMENT_TYPE.WHO_NOTIFIED_SITE_NOTICE),
			condition: () => documentExists(documents, APPEAL_DOCUMENT_TYPE.WHO_NOTIFIED_SITE_NOTICE),
			isEscaped: true
		},
		{
			keyText: 'Letter sent to neighbours',
			valueText: formatDocumentDetails(
				documents,
				APPEAL_DOCUMENT_TYPE.WHO_NOTIFIED_LETTER_TO_NEIGHBOURS
			),
			condition: () =>
				documentExists(documents, APPEAL_DOCUMENT_TYPE.WHO_NOTIFIED_LETTER_TO_NEIGHBOURS),
			isEscaped: true
		},
		{
			keyText: 'Press advert',
			valueText: formatDocumentDetails(documents, APPEAL_DOCUMENT_TYPE.WHO_NOTIFIED_PRESS_ADVERT),
			condition: () => documentExists(documents, APPEAL_DOCUMENT_TYPE.WHO_NOTIFIED_PRESS_ADVERT),
			isEscaped: true
		},
		{
			keyText: 'Appeal notification letter',
			valueText: formatDocumentDetails(documents, APPEAL_DOCUMENT_TYPE.APPEAL_NOTIFICATION),
			condition: () => documentExists(documents, APPEAL_DOCUMENT_TYPE.APPEAL_NOTIFICATION),
			isEscaped: true
		},
		{
			keyText: 'List of people sent enforcement notice',
			valueText: formatDocumentDetails(documents, APPEAL_DOCUMENT_TYPE.ENFORCEMENT_LIST),
			condition: () => documentExists(documents, APPEAL_DOCUMENT_TYPE.ENFORCEMENT_LIST),
			isEscaped: true
		}
	];
};
