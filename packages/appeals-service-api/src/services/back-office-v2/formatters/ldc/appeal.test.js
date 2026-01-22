const LpaEntity = require('../../../../models/entities/lpa-entity');
const { formatter } = require(`./appeal`);
const {
	APPEAL_APPLICATION_DECISION,
	APPEAL_CASE_PROCEDURE,
	APPEAL_CASE_TYPE,
	APPEAL_TYPE_OF_PLANNING_APPLICATION,
	APPEAL_APPELLANT_PROCEDURE_PREFERENCE,
	APPEAL_APPLICATION_MADE_UNDER_ACT_SECTION,
	SERVICE_USER_TYPE
} = require('@planning-inspectorate/data-model');

jest.mock('../../../../services/object-store');

// Mock getDocuments
jest.mock('../utils', () => {
	const originalModule = jest.requireActual('../utils');
	return {
		...originalModule,
		getDocuments: jest.fn(() => [1, { documentType: 'changedDescription' }])
	};
});

describe('LDC formatter', () => {
	/**
	 * @type {import('../utils').FullAppellantSubmission}
	 */
	let appellantSubmission;
	const lpa = new LpaEntity(123, 123, 123, 123, 'name', 'email', 'domain', true);
	const testDocuments = [1, { documentType: 'changedDescription' }];

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
			Appeal: {
				Users: [
					{
						AppealUser: { email: 'email' }
					}
				]
			},
			appealId: 'appeal123',
			appealTypeCode: 'LDC',
			onApplicationDate: new Date(),
			applicationDecision: APPEAL_APPLICATION_DECISION.GRANTED,
			applicationDecisionDate: new Date(),
			applicationReference: 'abc',
			appellantSiteAccess_appellantSiteAccessDetails: 'Access details',
			appellantSiteSafety_appellantSiteSafetyDetails: 'Safety details',
			developmentDescriptionOriginal: 'Original description',
			updateDevelopmentDescription: true,
			SubmissionLinkedCase: [{ caseReference: 'case123' }],
			costApplication: true,
			isAppellant: true,
			typeOfPlanningApplication: APPEAL_TYPE_OF_PLANNING_APPLICATION.OUTLINE_PLANNING,
			appellantProcedurePreference: 'inquiry',
			appellantPreferInquiryDetails: 'details',
			appellantPreferInquiryDuration: 13,
			appellantPreferInquiryWitnesses: 3,
			siteUseAtTimeOfApplication: 'lorum ipsum',
			applicationMadeUnderActSection:
				APPEAL_APPLICATION_MADE_UNDER_ACT_SECTION.PROPOSED_CHANGES_TO_A_LISTED_BUILDING
		};
	});

	it('should format the appellant submission correctly', async () => {
		const result = await formatter(appellantSubmission, lpa);

		expect(result).toEqual({
			casedata: {
				submissionId: 'appeal123',
				caseType: APPEAL_CASE_TYPE.X,
				caseProcedure: APPEAL_CASE_PROCEDURE.WRITTEN,
				lpaCode: 123,
				caseSubmittedDate: expect.any(String),
				enforcementNotice: false,
				applicationReference: 'abc',
				applicationDate: expect.any(String),
				applicationDecision: APPEAL_APPLICATION_DECISION.GRANTED,
				applicationDecisionDate: expect.any(String),
				caseSubmissionDueDate: expect.any(String),
				siteAddressLine1: 'Line 1',
				siteAddressLine2: 'Line 2',
				siteAddressTown: 'Town',
				siteAddressCounty: 'County',
				siteAddressPostcode: 'Postcode',
				siteAccessDetails: ['Access details'],
				siteSafetyDetails: ['Safety details'],
				isGreenBelt: null,
				siteAreaSquareMetres: null,
				floorSpaceSquareMetres: null,
				ownsAllLand: null,
				ownsSomeLand: null,
				knowsOtherOwners: null,
				knowsAllOwners: null,
				advertisedAppeal: null,
				ownersInformed: null,
				originalDevelopmentDescription: 'Original description',
				changedDevelopmentDescription: true,
				nearbyCaseReferences: ['case123'],
				appellantCostsAppliedFor: true,
				typeOfPlanningApplication: APPEAL_TYPE_OF_PLANNING_APPLICATION.OUTLINE_PLANNING,
				appellantProcedurePreference: APPEAL_APPELLANT_PROCEDURE_PREFERENCE.INQUIRY,
				appellantProcedurePreferenceDetails: 'details',
				appellantProcedurePreferenceDuration: 13,
				appellantProcedurePreferenceWitnessCount: 3,
				applicationMadeUnderActSection:
					APPEAL_APPLICATION_MADE_UNDER_ACT_SECTION.PROPOSED_CHANGES_TO_A_LISTED_BUILDING,
				siteUseAtTimeOfApplication: 'lorum ipsum'
			},
			documents: testDocuments,
			users: [
				{
					salutation: null,
					firstName: appellantSubmission.contactFirstName,
					lastName: appellantSubmission.contactLastName,
					emailAddress: appellantSubmission.Appeal.Users[0].AppealUser.email,
					serviceUserType: SERVICE_USER_TYPE.APPELLANT,
					telephoneNumber: appellantSubmission.contactPhoneNumber,
					organisation: null
				}
			]
		});
	});

	it('should handle S191 and S192 differences', async () => {
		const data = structuredClone(appellantSubmission);
		data.applicationDecision = null;
		data.applicationDecisionDate = null;

		const result = await formatter(data, lpa);

		expect(result).toEqual(
			expect.objectContaining({
				casedata: expect.objectContaining({
					applicationDecision: null,
					applicationDecisionDate: null
				})
			})
		);
	});

	it('should ensure ldc-about questions are nulled if existing development', async () => {
		const data = structuredClone(appellantSubmission);
		data.applicationMadeUnderActSection =
			APPEAL_APPLICATION_MADE_UNDER_ACT_SECTION.EXISTING_DEVELOPMENT;

		const result = await formatter(data, lpa);

		expect(result).toEqual(
			expect.objectContaining({
				casedata: expect.objectContaining({
					originalDevelopmentDescription: null
				}),
				documents: [1]
			})
		);
	});

	it('should format the agent submission correctly', async () => {
		const result = await formatter(
			{
				...appellantSubmission,
				isAppellant: false,
				appellantFirstName: 'bob',
				appellantLastName: 'test',
				appellantCompanyName: 'test co.'
			},
			lpa
		);

		expect(result).toEqual(
			expect.objectContaining({
				users: [
					{
						salutation: null,
						firstName: appellantSubmission.contactFirstName,
						lastName: appellantSubmission.contactLastName,
						emailAddress: appellantSubmission.Appeal.Users[0].AppealUser.email,
						serviceUserType: SERVICE_USER_TYPE.AGENT,
						telephoneNumber: appellantSubmission.contactPhoneNumber,
						organisation: null
					},
					{
						salutation: null,
						firstName: 'bob',
						lastName: 'test',
						emailAddress: null,
						serviceUserType: SERVICE_USER_TYPE.APPELLANT,
						telephoneNumber: null,
						organisation: 'test co.'
					}
				]
			})
		);
	});

	it('should throw an error if appellantSubmission is not provided', async () => {
		await expect(formatter(null)).rejects.toThrow();
	});
});
