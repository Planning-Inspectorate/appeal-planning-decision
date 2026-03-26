const {
	formatBeforeYouStartSection,
	formatQuestionnaireAppealInformationSection
} = require('./submission-information-utils');
const { getLPA, getLPAById } = require('../../../lib/appeals-api-wrapper');
const { APPEAL_USER_ROLES, LPA_USER_ROLE } = require('@pins/common/src/constants');
const { CASE_TYPES } = require('@pins/common/src/database/data-static');

jest.mock('../../../lib/appeals-api-wrapper');

describe('formatBeforeYouStartSection', () => {
	const mockAppellantSubmission = {
		LPACode: '123',
		appealTypeCode: CASE_TYPES.HAS.processCode,
		applicationDecisionDate: '2023-01-01'
	};

	const mockEnforcementAppellantSubmission = {
		LPACode: '123',
		appealTypeCode: CASE_TYPES.ENFORCEMENT.processCode,
		enforcementIssueDate: '2023-01-01',
		enforcementEffectiveDate: '2023-01-08',
		enforcementReferenceNumber: 'testEnfRef'
	};

	const mockLPA = { name: 'Test LPA' };

	beforeEach(() => {
		getLPA.mockClear();
		getLPAById.mockClear();
	});

	it('should format the section correctly when getLPA succeeds', async () => {
		getLPA.mockResolvedValue(mockLPA);

		const result = await formatBeforeYouStartSection(mockAppellantSubmission);

		expect(getLPA).toHaveBeenCalledWith('123');
		expect(getLPAById).not.toHaveBeenCalled();

		expect(result).toEqual({
			heading: 'Before you start',
			list: {
				rows: [
					{
						key: { text: 'Local planning authority', classes: 'govuk-!-width-one-half' },
						value: { html: 'Test LPA' }
					},
					{
						key: { text: 'Appeal type', classes: 'govuk-!-width-one-half' },
						value: { html: 'Householder' }
					},
					{
						key: { text: 'Decision date', classes: 'govuk-!-width-one-half' },
						value: { html: '1 January 2023' }
					}
				]
			}
		});
	});

	it('should format the section correctly when getLPA fails and getLPAById succeeds', async () => {
		getLPA.mockRejectedValue(new Error('LPA not found'));
		getLPAById.mockResolvedValue(mockLPA);

		const result = await formatBeforeYouStartSection(mockAppellantSubmission);

		expect(getLPA).toHaveBeenCalledWith('123');
		expect(getLPAById).toHaveBeenCalledWith('123');

		expect(result).toEqual({
			heading: 'Before you start',
			list: {
				rows: [
					{
						key: { text: 'Local planning authority', classes: 'govuk-!-width-one-half' },
						value: { html: 'Test LPA' }
					},
					{
						key: { text: 'Appeal type', classes: 'govuk-!-width-one-half' },
						value: { html: 'Householder' }
					},
					{
						key: { text: 'Decision date', classes: 'govuk-!-width-one-half' },
						value: { html: '1 January 2023' }
					}
				]
			}
		});
	});

	it.each([
		['Householder', 'HAS'],
		['Full planning', 'S78'],
		['Planning listed building and conservation area', 'S20'],
		['Advertisement', 'ADVERTS'],
		['Commercial advertisement', 'CAS_ADVERTS'],
		['Commercial planning (CAS)', 'CAS_PLANNING']
	])(
		'formats section correctly for a non-enforcement appealType',
		async (appealType, appealTypeCode) => {
			mockAppellantSubmission.appealTypeCode = appealTypeCode;
			const result = await formatBeforeYouStartSection(mockAppellantSubmission);

			expect(result).toEqual({
				heading: 'Before you start',
				list: {
					rows: [
						{
							key: { text: 'Local planning authority', classes: 'govuk-!-width-one-half' },
							value: { html: 'Test LPA' }
						},
						{
							key: { text: 'Appeal type', classes: 'govuk-!-width-one-half' },
							value: { html: appealType }
						},
						{
							key: { text: 'Decision date', classes: 'govuk-!-width-one-half' },
							value: { html: '1 January 2023' }
						}
					]
				}
			});
		}
	);

	it('formats section correctly for an enforcement notice appealType', async () => {
		const result = await formatBeforeYouStartSection(mockEnforcementAppellantSubmission);

		expect(result).toEqual({
			heading: 'Before you start',
			list: {
				rows: [
					{
						key: { text: 'Local planning authority', classes: 'govuk-!-width-one-half' },
						value: { html: 'Test LPA' }
					},
					{
						key: { text: 'Appeal type', classes: 'govuk-!-width-one-half' },
						value: { html: CASE_TYPES.ENFORCEMENT.type }
					},
					{
						key: {
							text: 'Is your enforcement notice about a listed building?',
							classes: 'govuk-!-width-one-half'
						},
						value: { html: 'No' }
					},
					{
						key: {
							text: 'What is the issue date on your enforcement notice?',
							classes: 'govuk-!-width-one-half'
						},
						value: { html: '1 January 2023' }
					},
					{
						key: {
							text: 'What is the effective date on your enforcement notice?',
							classes: 'govuk-!-width-one-half'
						},
						value: { html: '8 January 2023' }
					},
					{
						key: {
							text: 'What is the reference number on the enforcement notice?',
							classes: 'govuk-!-width-one-half'
						},
						value: { html: 'testEnfRef' }
					}
				]
			}
		});
	});

	it('formats section correctly for an enforcement notice appealType with prior contact of PINS', async () => {
		const testSubmission = structuredClone(mockEnforcementAppellantSubmission);
		testSubmission.hasContactedPlanningInspectorate = true;
		testSubmission.contactPlanningInspectorateDate = '2023-01-01';

		const result = await formatBeforeYouStartSection(testSubmission);

		expect(result).toEqual({
			heading: 'Before you start',
			list: {
				rows: [
					{
						key: { text: 'Local planning authority', classes: 'govuk-!-width-one-half' },
						value: { html: 'Test LPA' }
					},
					{
						key: { text: 'Appeal type', classes: 'govuk-!-width-one-half' },
						value: { html: CASE_TYPES.ENFORCEMENT.type }
					},
					{
						key: {
							text: 'Is your enforcement notice about a listed building?',
							classes: 'govuk-!-width-one-half'
						},
						value: { html: 'No' }
					},
					{
						key: {
							text: 'What is the issue date on your enforcement notice?',
							classes: 'govuk-!-width-one-half'
						},
						value: { html: '1 January 2023' }
					},
					{
						key: {
							text: 'What is the effective date on your enforcement notice?',
							classes: 'govuk-!-width-one-half'
						},
						value: { html: '8 January 2023' }
					},
					{
						key: {
							text: 'Did you contact the Planning Inspectorate to tell them you will appeal the enforcement notice?',
							classes: 'govuk-!-width-one-half'
						},
						value: { html: 'Yes' }
					},
					{
						key: {
							text: 'When did you contact the Planning Inspectorate?',
							classes: 'govuk-!-width-one-half'
						},
						value: { html: '1 January 2023' }
					},
					{
						key: {
							text: 'What is the reference number on the enforcement notice?',
							classes: 'govuk-!-width-one-half'
						},
						value: { html: 'testEnfRef' }
					}
				]
			}
		});
	});

	it('formats section correctly for an ELB appealType', async () => {
		const testSubmission = structuredClone(mockEnforcementAppellantSubmission);
		testSubmission.appealTypeCode = CASE_TYPES.ENFORCEMENT_LISTED.processCode;
		const result = await formatBeforeYouStartSection(testSubmission);

		expect(result).toEqual({
			heading: 'Before you start',
			list: {
				rows: [
					{
						key: { text: 'Local planning authority', classes: 'govuk-!-width-one-half' },
						value: { html: 'Test LPA' }
					},
					{
						key: { text: 'Appeal type', classes: 'govuk-!-width-one-half' },
						value: { html: CASE_TYPES.ENFORCEMENT_LISTED.type }
					},
					{
						key: {
							text: 'Is your enforcement notice about a listed building?',
							classes: 'govuk-!-width-one-half'
						},
						value: { html: 'Yes' }
					},
					{
						key: {
							text: 'What is the issue date on your enforcement notice?',
							classes: 'govuk-!-width-one-half'
						},
						value: { html: '1 January 2023' }
					},
					{
						key: {
							text: 'What is the effective date on your enforcement notice?',
							classes: 'govuk-!-width-one-half'
						},
						value: { html: '8 January 2023' }
					},
					{
						key: {
							text: 'What is the reference number on the enforcement notice?',
							classes: 'govuk-!-width-one-half'
						},
						value: { html: 'testEnfRef' }
					}
				]
			}
		});
	});
});

describe('formatQuestionnaireAppealInformationSection', () => {
	it.each([
		['Householder', 'HAS'],
		['Full planning', 'S78'],
		['Planning listed building and conservation area', 'S20'],
		['Advertisement', 'ADVERTS'],
		['Commercial advertisement', 'CAS_ADVERTS'],
		['Commercial planning (CAS)', 'CAS_PLANNING']
	])('formats section correctly for appealType', (appealType, appealTypeCode) => {
		const appeal = {
			appealTypeCode: appealTypeCode,
			applicationReference: '123/abc/678',
			users: [
				{ firstName: 'Fname', lastName: 'Lname', serviceUserType: APPEAL_USER_ROLES.APPELLANT }
			],
			siteAddressLine1: 'Line 1',
			siteAddressLine2: 'Line 2',
			siteAddressTown: 'Town',
			siteAddressPostcode: 'AB1 2CD'
		};

		const expectedResult = {
			list: {
				rows: [
					{
						key: {
							text: 'Appeal type',
							classes: 'govuk-!-width-one-half'
						},
						value: {
							html: appealType
						}
					},
					{
						key: {
							text: 'Appeal site',
							classes: 'govuk-!-width-one-half'
						},
						value: {
							html: 'Line 1, Line 2, Town, AB1 2CD'
						}
					},
					{
						key: {
							text: 'Appellant contact details',
							classes: 'govuk-!-width-one-half'
						},
						value: {
							html: 'Fname Lname'
						}
					},
					{
						key: {
							text: 'Application number',
							classes: 'govuk-!-width-one-half'
						},
						value: {
							html: '123/abc/678'
						}
					}
				]
			}
		};

		expect(formatQuestionnaireAppealInformationSection(appeal, LPA_USER_ROLE)).toEqual(
			expectedResult
		);
	});
});
