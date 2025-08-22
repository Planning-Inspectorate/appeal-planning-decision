const { CASE_TYPES } = require('@pins/common/src/database/data-static');
const { notifiedRows } = require('./notified-details-rows');
const { caseTypeLPAQFactory } = require('./test-factory');

describe('notifiedDetailsRows', () => {
	it('should create rows with correct data if relevant case data fields exist and files uploaded/field values otherwise populated', () => {
		const caseData = caseTypeLPAQFactory(CASE_TYPES.S20.processCode, 'notifiedParties');

		const expectedRows = [
			{ title: 'Who was notified', value: 'name.pdf - awaiting review' },
			{ title: 'Type of Notification', value: '' },
			{ title: 'Site notice', value: 'name.pdf - awaiting review' },
			{
				title: 'Letter sent to neighbours',
				value: 'name.pdf - awaiting review'
			},
			{ title: 'Press advert', value: 'name.pdf - awaiting review' },
			{
				title: 'Appeal notification letter',
				value: 'name.pdf - awaiting review'
			}
		];

		const visibleRows = notifiedRows(caseData)
			.filter((row) => row.condition(caseData))
			.map((visibleRow) => {
				return { title: visibleRow.keyText, value: visibleRow.valueText };
			});
		expect(visibleRows).toEqual(expectedRows);
	});

	it('should not display if no fields/files exist', () => {
		const expectedRows = [
			{ title: 'Who was notified', value: 'No' },
			{ title: 'Type of Notification', value: '' },
			{ title: 'Site notice', value: 'No' },
			{ title: 'Letter sent to neighbours', value: 'No' },
			{ title: 'Press advert', value: 'No' },
			{ title: 'Appeal notification letter', value: 'No' }
		];

		const visibleRows = notifiedRows({
			AppealCaseLpaNotificationMethod: [],
			Documents: []
		}).map((visibleRow) => {
			return { title: visibleRow.keyText, value: visibleRow.valueText };
		});
		expect(visibleRows).toEqual(expectedRows);
	});
});
