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
	])('formats section correctly for appealType', async (appealType, appealTypeCode) => {
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
