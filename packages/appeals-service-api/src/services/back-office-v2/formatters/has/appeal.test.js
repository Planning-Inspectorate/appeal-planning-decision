const { formatter } = require(`./appeal`);
const {
	getDocuments,
	formatApplicationSubmissionUsers,
	formatApplicationDecision,
	formatYesNoSomeAnswer
} = require(`../utils`);
const deadlineDate = require('@pins/business-rules/src/rules/appeal/deadline-date');
const { APPEAL_CASE_PROCEDURE, APPEAL_CASE_TYPE } = require('pins-data-model');

jest.mock('../../../lpa.service', () => {
	return jest.fn().mockImplementation(() => {
		return {
			getLpaByCode: jest.fn().mockResolvedValue({ getLpaCode: jest.fn().mockReturnValue('123') })
		};
	});
});
jest.mock('../../../../errors/apiError');
jest.mock(`../../../back-office-v2/formatters/utils`);

jest.mock('@pins/business-rules/src/rules/appeal/deadline-date');

describe('formatter', () => {
	let appellantSubmission;

	const testDocuments = [1];
	const testUsers = [1];

	beforeEach(() => {
		jest.clearAllMocks();
		appellantSubmission = {
			LPACode: '123',
			SubmissionAddress: [
				{
					fieldName: 'siteAddress',
					addressLine1: 'Line 1',
					addressLine2: 'Line 2',
					townCity: 'Town',
					county: 'County',
					postcode: 'Postcode'
				}
			],
			appealId: 'appeal123',
			onApplicationDate: new Date(),
			applicationDecision: 'granted',
			applicationDecisionDate: new Date(),
			appellantSiteAccess_appellantSiteAccessDetails: 'Access details',
			appellantSiteSafety_appellantSiteSafetyDetails: 'Safety details',
			appellantGreenBelt: true,
			siteAreaSquareMetres: '100',
			ownsAllLand: true,
			ownsSomeLand: false,
			knowsOtherOwners: 'yes',
			knowsAllOwners: 'no',
			advertisedAppeal: true,
			informedOwners: true,
			developmentDescriptionOriginal: 'Original description',
			updateDevelopmentDescription: 'Updated description',
			SubmissionLinkedCase: [{ caseReference: 'case123' }],
			costApplication: true
		};

		getDocuments.mockResolvedValue(testDocuments);
		formatApplicationSubmissionUsers.mockReturnValue(testUsers);
		formatApplicationDecision.mockReturnValue('formattedDecision');
		formatYesNoSomeAnswer.mockReturnValue('formattedAnswer');
		deadlineDate.mockReturnValue(new Date());
	});

	it('should format the appellant submission correctly', async () => {
		const result = await formatter(appellantSubmission);

		expect(result).toEqual({
			casedata: {
				submissionId: 'appeal123',
				caseType: APPEAL_CASE_TYPE.D,
				caseProcedure: APPEAL_CASE_PROCEDURE.WRITTEN,
				lpaCode: '123',
				caseSubmittedDate: expect.any(String),
				enforcementNotice: false,
				applicationReference: '',
				applicationDate: expect.any(String),
				applicationDecision: 'formattedDecision',
				applicationDecisionDate: expect.any(String),
				caseSubmissionDueDate: expect.any(String),
				siteAddressLine1: 'Line 1',
				siteAddressLine2: 'Line 2',
				siteAddressTown: 'Town',
				siteAddressCounty: 'County',
				siteAddressPostcode: 'Postcode',
				siteAccessDetails: ['Access details'],
				siteSafetyDetails: ['Safety details'],
				isGreenBelt: true,
				siteAreaSquareMetres: 100,
				floorSpaceSquareMetres: 100,
				ownsAllLand: true,
				ownsSomeLand: false,
				knowsOtherOwners: 'formattedAnswer',
				knowsAllOwners: 'formattedAnswer',
				advertisedAppeal: true,
				ownersInformed: true,
				originalDevelopmentDescription: 'Original description',
				changedDevelopmentDescription: 'Updated description',
				nearbyCaseReferences: ['case123'],
				neighbouringSiteAddresses: null,
				appellantCostsAppliedFor: true
			},
			documents: testDocuments,
			users: testUsers
		});
	});

	it('should throw an error if appellantSubmission is not provided', async () => {
		await expect(formatter(null)).rejects.toThrow('Appeal submission could not be formatted');
	});
});
