const { environmentalRows } = require('./environmental-details-rows');
const { APPEAL_DOCUMENT_TYPE } = require('@planning-inspectorate/data-model');
const { caseTypeLPAQFactory } = require('./test-factory');
const { CASE_TYPES } = require('@pins/common/src/database/data-static');

describe('environmentalRows', () => {
	const eiaSchedule1Data = caseTypeLPAQFactory(CASE_TYPES.S78.processCode, 'eia', 'schedule-1');
	const eiaSchedule2Data = caseTypeLPAQFactory(CASE_TYPES.S20.processCode, 'eia', 'schedule-2');
	const eiaNullData = caseTypeLPAQFactory(CASE_TYPES.S20.processCode, 'eia', null);

	const expectedSchedule1Rows = [
		{ title: 'Schedule type', value: 'Schedule 1' },
		{ title: 'Did Environmental statement', value: 'No' },
		{
			title: 'Uploaded environmental statement',
			value: 'name.pdf - awaiting review'
		}
	];
	const expectedSchedule2Rows = [
		{ title: 'Schedule type', value: 'Schedule 2' },
		{
			title: 'Development description',
			value: 'Agriculture and aquaculture'
		},
		{
			title: 'In, partly in, or likely to affect sensitive area',
			value: 'Yes\nSensitive area details here'
		},
		{
			title: 'Meets or exceeds threshold or criteria in column 2',
			value: 'Yes'
		},
		{ title: 'Issued screening opinion', value: 'Yes' },
		{
			title: 'Uploaded screening opinion',
			value: 'name.pdf - awaiting review'
		},
		{ title: 'Received scoping opinion', value: 'Yes' },
		{
			title: 'Uploaded scoping opinion',
			value: 'name.pdf - awaiting review'
		},
		{
			title: 'Screening opinion indicated environmental statement needed',
			value: 'Yes'
		},
		{ title: 'Did Environmental statement', value: 'Yes' },
		{
			title: 'Uploaded environmental statement',
			value: 'name.pdf - awaiting review'
		}
	];
	const expectedNullRows = [
		{ title: 'Schedule type', value: 'Other' },
		{ title: 'Issued screening opinion', value: 'Yes' },
		{
			title: 'Uploaded screening opinion',
			value: 'name.pdf - awaiting review'
		},
		{ title: 'Received scoping opinion', value: 'Yes' },
		{
			title: 'Uploaded scoping opinion',
			value: 'name.pdf - awaiting review'
		},
		{
			title: 'Screening opinion indicated environmental statement needed',
			value: ''
		},
		{ title: 'Did Environmental statement', value: '' },
		{
			title: 'Uploaded environmental statement',
			value: 'name.pdf - awaiting review'
		}
	];

	it.each([
		['schedule-1', eiaSchedule1Data, expectedSchedule1Rows],
		['schedule-2', eiaSchedule2Data, expectedSchedule2Rows],
		['null', eiaNullData, expectedNullRows]
	])(`should create correct rows for appeal type %s`, (_, caseData, expectedRows) => {
		const visibleRows = environmentalRows(caseData)
			.filter((row) => row.condition(caseData))
			.map((visibleRow) => {
				return { title: visibleRow.keyText, value: visibleRow.valueText };
			});
		expect(visibleRows).toEqual(expectedRows);
	});

	it('should show a document', () => {
		const rows = environmentalRows({
			appealTypeCode: CASE_TYPES.S20.processCode,
			Documents: [
				{
					id: 1,
					documentType: APPEAL_DOCUMENT_TYPE.EIA_SCREENING_OPINION,
					filename: 'test.txt',
					redacted: true
				}
			]
		});

		expect(rows[5].condition()).toEqual(true);
		expect(rows[5].isEscaped).toEqual(true);
		expect(rows[5].keyText).toEqual('Uploaded screening opinion');
		expect(rows[5].valueText).toEqual(
			'<a href="/published-document/1" class="govuk-link">test.txt</a>'
		);
	});

	it('should show a document', () => {
		const rows = environmentalRows({
			appealTypeCode: CASE_TYPES.S78.processCode,
			Documents: [
				{
					id: 2,
					documentType: APPEAL_DOCUMENT_TYPE.EIA_SCOPING_OPINION,
					filename: 'scoping_opinion.txt',
					redacted: true
				}
			]
		});

		expect(rows[7].condition()).toEqual(true);
		expect(rows[7].isEscaped).toEqual(true);
		expect(rows[7].keyText).toEqual('Uploaded scoping opinion');
		expect(rows[7].valueText).toEqual(
			'<a href="/published-document/2" class="govuk-link">scoping_opinion.txt</a>'
		);
	});
});
