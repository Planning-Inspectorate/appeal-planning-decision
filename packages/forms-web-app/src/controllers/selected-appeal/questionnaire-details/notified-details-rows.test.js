const { APPEAL_DOCUMENT_TYPE } = require('@planning-inspectorate/data-model');
const { LPA_NOTIFICATION_METHODS } = require('@pins/common/src/database/data-static');
const { notifiedRows } = require('./notified-details-rows');

describe('notifiedDetailsRows', () => {
	const whoNotifiedRow = 0;
	const typeRow = 1;
	const noticeRow = 2;
	const letterRow = 3;
	const advertRow = 4;
	const appealNotificatonRow = 5;

	it('should create rows with correct data if relevant case data fields exist and files uploaded/field values otherwise populated', () => {
		const caseData = {
			AppealCaseLpaNotificationMethod: [
				{ lPANotificationMethodsKey: LPA_NOTIFICATION_METHODS.notice.key },
				{ lPANotificationMethodsKey: LPA_NOTIFICATION_METHODS.letter.key },
				{ lPANotificationMethodsKey: LPA_NOTIFICATION_METHODS.pressAdvert.key }
			],
			Documents: [
				{
					documentType: APPEAL_DOCUMENT_TYPE.WHO_NOTIFIED,
					id: '12345',
					filename: 'whonotified1.pdf',
					redacted: true
				},
				{
					documentType: APPEAL_DOCUMENT_TYPE.WHO_NOTIFIED_SITE_NOTICE,
					id: '12346',
					filename: 'sitenotice1.pdf',
					redacted: true
				},
				{
					documentType: APPEAL_DOCUMENT_TYPE.WHO_NOTIFIED_LETTER_TO_NEIGHBOURS,
					id: '12347',
					filename: 'neighbours.pdf',
					redacted: true
				},
				{
					documentType: APPEAL_DOCUMENT_TYPE.WHO_NOTIFIED_PRESS_ADVERT,
					id: '12348',
					filename: 'press.pdf',
					redacted: true
				},
				{
					documentType: APPEAL_DOCUMENT_TYPE.APPEAL_NOTIFICATION,
					id: '12349',
					filename: 'appeal-notifcation.pdf',
					redacted: true
				}
			]
		};

		const rows = notifiedRows(caseData);

		expect(rows.length).toEqual(6);

		expect(rows[whoNotifiedRow].condition()).toEqual(true);
		expect(rows[whoNotifiedRow].keyText).toEqual('Who was notified');
		expect(rows[whoNotifiedRow].valueText).toEqual(
			'<a href="/published-document/12345" class="govuk-link">whonotified1.pdf</a>'
		);
		expect(rows[whoNotifiedRow].isEscaped).toEqual(true);

		expect(rows[typeRow].condition()).toEqual(true);
		expect(rows[typeRow].keyText).toEqual('Type of Notification');
		expect(rows[typeRow].valueText).toEqual(
			'A site notice\nLetter/email to interested parties\nA press advert'
		);

		expect(rows[noticeRow].condition()).toEqual(true);
		expect(rows[noticeRow].keyText).toEqual('Site notice');
		expect(rows[noticeRow].valueText).toEqual(
			'<a href="/published-document/12346" class="govuk-link">sitenotice1.pdf</a>'
		);
		expect(rows[noticeRow].isEscaped).toEqual(true);

		expect(rows[letterRow].condition()).toEqual(true);
		expect(rows[letterRow].keyText).toEqual('Letter sent to neighbours');
		expect(rows[letterRow].valueText).toEqual(
			'<a href="/published-document/12347" class="govuk-link">neighbours.pdf</a>'
		);
		expect(rows[letterRow].isEscaped).toEqual(true);

		expect(rows[advertRow].condition()).toEqual(true);
		expect(rows[advertRow].keyText).toEqual('Press advert');
		expect(rows[advertRow].valueText).toEqual(
			'<a href="/published-document/12348" class="govuk-link">press.pdf</a>'
		);
		expect(rows[advertRow].isEscaped).toEqual(true);

		expect(rows[appealNotificatonRow].condition()).toEqual(true);
		expect(rows[appealNotificatonRow].keyText).toEqual('Appeal notification letter');
		expect(rows[appealNotificatonRow].valueText).toEqual(
			'<a href="/published-document/12349" class="govuk-link">appeal-notifcation.pdf</a>'
		);
		expect(rows[appealNotificatonRow].isEscaped).toEqual(true);
	});

	it('should not display if no fields/files exist', () => {
		const rows = notifiedRows({
			AppealCaseLpaNotificationMethod: [],
			Documents: []
		});

		expect(rows.length).toEqual(6);
		expect(rows[whoNotifiedRow].condition()).toEqual(false);
		expect(rows[typeRow].condition()).toEqual(false);
		expect(rows[noticeRow].condition()).toEqual(false);
		expect(rows[letterRow].condition()).toEqual(false);
		expect(rows[advertRow].condition()).toEqual(false);
		expect(rows[appealNotificatonRow].condition()).toEqual(false);
	});
});
