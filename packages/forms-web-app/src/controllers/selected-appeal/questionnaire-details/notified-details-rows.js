const { formatDocumentDetails } = require('@pins/common');

/**
 * @param {import('appeals-service-api').Api.AppealCaseDetailed } caseData
 * @returns {import("@pins/common/src/view-model-maps/rows/def").Rows}
 */
exports.notifiedRows = (caseData) => {
	const documents = caseData.Documents || [];
	return [
		{
			keyText: 'Who was notified',
			valueText: formatDocumentDetails(documents, 'whoNotified'),
			condition: () => caseData.uploadWhoNotified,
			isEscaped: true
		},
		// TODO data model will need adjusting for possible multiple answers
		// {
		// 	keyText: 'Type of Notification',
		// 	valueText: formatNotificationMethod(caseData),
		// 	condition: () => caseData.notificationMethod
		// },
		{
			keyText: 'Site notice',
			valueText: formatDocumentDetails(documents, 'siteNotice'),
			condition: () => caseData.uploadSiteNotice,
			isEscaped: true
		},
		{
			keyText: 'Letters sent to neighbours',
			valueText: formatDocumentDetails(documents, 'lettersNeighbours'),
			condition: () => caseData.uploadLettersEmails,
			isEscaped: true
		},
		{
			keyText: 'Press advert',
			valueText: formatDocumentDetails(documents, 'pressAdvert'),
			condition: () => caseData.uploadPressAdvert,
			isEscaped: true
		}
	];
};
