const { APPEAL_DOCUMENT_TYPE } = require('pins-data-model');
const { LPA_NOTIFICATION_METHODS } = require('@pins/common/src/database/data-static');
const { notifiedRows } = require('./notified-details-rows');

describe('notifiedDetailsRows', () => {
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
				}
			]
		};

		const rows = notifiedRows(caseData);

		expect(rows.length).toEqual(5);
		expect(rows[0].condition()).toEqual(true);
		expect(rows[0].keyText).toEqual('Who was notified');
		expect(rows[0].valueText).toEqual(
			'<a href="/published-document/12345" class="govuk-link">whonotified1.pdf</a>'
		);
		expect(rows[0].isEscaped).toEqual(true);

		expect(rows[1].condition()).toEqual(true);
		expect(rows[1].keyText).toEqual('Type of Notification');
		expect(rows[1].valueText).toEqual(
			'A site notice\nLetter/email to interested parties\nA press advert'
		);

		expect(rows[2].condition()).toEqual(true);
		expect(rows[2].keyText).toEqual('Site notice');
		expect(rows[2].valueText).toEqual(
			'<a href="/published-document/12346" class="govuk-link">sitenotice1.pdf</a>'
		);
		expect(rows[2].isEscaped).toEqual(true);

		expect(rows[3].condition()).toEqual(true);
		expect(rows[3].keyText).toEqual('Letters sent to neighbours');
		expect(rows[3].valueText).toEqual(
			'<a href="/published-document/12347" class="govuk-link">neighbours.pdf</a>'
		);
		expect(rows[3].isEscaped).toEqual(true);

		expect(rows[4].condition()).toEqual(true);
		expect(rows[4].keyText).toEqual('Press advert');
		expect(rows[4].valueText).toEqual(
			'<a href="/published-document/12348" class="govuk-link">press.pdf</a>'
		);
		expect(rows[4].isEscaped).toEqual(true);
	});

	it('should not display if no fields/files exist', () => {
		const rows = notifiedRows({
			AppealCaseLpaNotificationMethod: [],
			Documents: []
		});

		expect(rows.length).toEqual(5);
		expect(rows[0].condition()).toEqual(false);
		expect(rows[1].condition()).toEqual(false);
		expect(rows[2].condition()).toEqual(false);
		expect(rows[3].condition()).toEqual(false);
		expect(rows[4].condition()).toEqual(false);
	});
});
