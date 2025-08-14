const { APPEAL_LINKED_CASE_STATUS } = require('@planning-inspectorate/data-model');
const {
	mapLinkedCaseStatusLabel,
	formatDashboardLinkedCaseDetails
} = require('@pins/common/src/lib/linked-appeals');

const testLeadRef = 'testLead1';
const testChildRef = 'testChild2';
const testLinkedCases = [
	{
		childCaseReference: testChildRef,
		leadCaseReference: testLeadRef
	}
];

describe('lib/linked-appeals', () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	describe('mapLinkedCaseStatusLabel', () => {
		test.each([
			[APPEAL_LINKED_CASE_STATUS.LEAD, 'Lead'],
			[APPEAL_LINKED_CASE_STATUS.CHILD, 'Child'],
			[undefined, null],
			['InvalidLinkedStatus', undefined]
		])('correctly maps a %s linked case status to a %s display label', (linkedStatus, label) => {
			expect(mapLinkedCaseStatusLabel(linkedStatus)).toBe(label);
		});
	});

	describe('formatDashboardLinkedCaseDetails', () => {
		test.each([
			[
				{
					caseReference: testLeadRef,
					linkedCases: testLinkedCases
				},
				{
					linkedCaseStatus: APPEAL_LINKED_CASE_STATUS.LEAD,
					leadCaseReference: testLeadRef,
					linkedCaseStatusLabel: 'Lead'
				}
			],
			[
				{
					caseReference: testChildRef,
					linkedCases: testLinkedCases
				},
				{
					linkedCaseStatus: APPEAL_LINKED_CASE_STATUS.CHILD,
					leadCaseReference: testLeadRef,
					linkedCaseStatusLabel: 'Child'
				}
			],
			[
				{
					caseReference: 'Not linked case',
					linkedCases: undefined
				},
				null
			]
		])('correctly maps a case to dashboard display', (appealCase, displayObject) => {
			expect(formatDashboardLinkedCaseDetails(appealCase)).toEqual(displayObject);
		});
	});
});
