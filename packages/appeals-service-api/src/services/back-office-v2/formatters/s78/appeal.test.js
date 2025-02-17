const LpaEntity = require('../../../../models/entities/lpa-entity');
const { formatter } = require(`./appeal`);
const {
	APPEAL_APPELLANT_PROCEDURE_PREFERENCE,
	APPEAL_APPLICATION_DECISION,
	APPEAL_CASE_PROCEDURE,
	APPEAL_CASE_TYPE,
	SERVICE_USER_TYPE
} = require('pins-data-model');

jest.mock('../../../../services/object-store');

// Mock getDocuments
jest.mock('../utils', () => {
	const originalModule = jest.requireActual('../utils');
	return {
		...originalModule,
		getDocuments: jest.fn(() => [1])
	};
});

describe('S78 formatter', () => {
	/**
	 * @type {import('../utils').FullAppellantSubmission}
	 */
	let appellantSubmission;
	const lpa = new LpaEntity(123, 123, 123, 123, 'name', 'email', 'domain', true);
	const testDocuments = [1];

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
			appealTypeCode: 'S78',
			onApplicationDate: new Date(),
			applicationDecision: APPEAL_APPLICATION_DECISION.GRANTED,
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
			costApplication: true,
			isAppellant: true,

			agriculturalHolding: true,
			tenantAgriculturalHolding: true,
			otherTenantsAgriculturalHolding: true,
			informedTenantsAgriculturalHolding: true,

			planningObligation: true,
			statusPlanningObligation: 'test',

			appellantProcedurePreference: 'inquiry',
			appellantPreferInquiryDetails: 'details',
			appellantPreferInquiryDuration: 13,
			appellantPreferInquiryWitnesses: 3
		};
	});

	it('should format the appellant submission correctly', async () => {
		const result = await formatter(appellantSubmission, lpa);

		expect(result).toEqual({
			casedata: {
				submissionId: 'appeal123',
				caseType: APPEAL_CASE_TYPE.W,
				developmentType: 'householder',
				caseProcedure: APPEAL_CASE_PROCEDURE.WRITTEN,
				lpaCode: 123,
				caseSubmittedDate: expect.any(String),
				enforcementNotice: false,
				applicationReference: '',
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
				isGreenBelt: true,
				siteAreaSquareMetres: 100,
				floorSpaceSquareMetres: 100,
				ownsAllLand: true,
				ownsSomeLand: false,
				knowsOtherOwners: 'Yes',
				knowsAllOwners: 'No',
				advertisedAppeal: true,
				ownersInformed: true,
				originalDevelopmentDescription: 'Original description',
				changedDevelopmentDescription: 'Updated description',
				nearbyCaseReferences: ['case123'],
				neighbouringSiteAddresses: null,
				appellantCostsAppliedFor: true,
				agriculturalHolding: true,
				tenantAgriculturalHolding: true,
				otherTenantsAgriculturalHolding: true,
				informedTenantsAgriculturalHolding: true,
				appellantProcedurePreference: APPEAL_APPELLANT_PROCEDURE_PREFERENCE.INQUIRY,
				appellantProcedurePreferenceDetails: 'details',
				appellantProcedurePreferenceDuration: 13,
				inquiryHowManyWitnesses: 3,
				planningObligation: true,
				statusPlanningObligation: 'test'
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

	it('should format the agent submission correctly', async () => {
		const result = await formatter(
			{
				...appellantSubmission,
				isAppellant: false,
				appellantFirstName: 'bob',
				appellantLastName: 'test',
				appellantCompanyName: 'test co.',
				appellantProcedurePreference: 'hearing',
				appellantPreferHearingDetails: 'details 2',
				agriculturalHolding: false
			},
			lpa
		);

		expect(result).toEqual({
			casedata: {
				submissionId: 'appeal123',
				caseType: APPEAL_CASE_TYPE.W,
				developmentType: 'householder',
				caseProcedure: APPEAL_CASE_PROCEDURE.WRITTEN,
				lpaCode: 123,
				caseSubmittedDate: expect.any(String),
				enforcementNotice: false,
				applicationReference: '',
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
				isGreenBelt: true,
				siteAreaSquareMetres: 100,
				floorSpaceSquareMetres: 100,
				ownsAllLand: true,
				ownsSomeLand: false,
				knowsOtherOwners: 'Yes',
				knowsAllOwners: 'No',
				advertisedAppeal: true,
				ownersInformed: true,
				originalDevelopmentDescription: 'Original description',
				changedDevelopmentDescription: 'Updated description',
				nearbyCaseReferences: ['case123'],
				neighbouringSiteAddresses: null,
				appellantCostsAppliedFor: true,
				agriculturalHolding: false,
				tenantAgriculturalHolding: null,
				otherTenantsAgriculturalHolding: null,
				informedTenantsAgriculturalHolding: null,
				appellantProcedurePreference: APPEAL_APPELLANT_PROCEDURE_PREFERENCE.HEARING,
				appellantProcedurePreferenceDetails: 'details 2',
				appellantProcedurePreferenceDuration: null,
				inquiryHowManyWitnesses: null,
				planningObligation: true,
				statusPlanningObligation: 'test'
			},
			documents: testDocuments,
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
		});
	});

	it('should throw an error if appellantSubmission is not provided', async () => {
		await expect(formatter(null)).rejects.toThrow();
	});
});
