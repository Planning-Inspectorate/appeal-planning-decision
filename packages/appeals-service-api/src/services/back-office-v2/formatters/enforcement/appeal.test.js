const LpaEntity = require('../../../../models/entities/lpa-entity');
const { formatter } = require(`./appeal`);
const {
	APPEAL_APPELLANT_PROCEDURE_PREFERENCE,
	APPEAL_APPLICATION_DECISION,
	APPEAL_CASE_PROCEDURE,
	APPEAL_CASE_TYPE,
	// APPEAL_TYPE_OF_PLANNING_APPLICATION,
	SERVICE_USER_TYPE
} = require('@planning-inspectorate/data-model');
const { fieldValues } = require('@pins/common/src/dynamic-forms/field-values');

jest.mock('../../../../services/object-store');

// Mock getDocuments
jest.mock('../utils', () => {
	const originalModule = jest.requireActual('../utils');
	return {
		...originalModule,
		getDocuments: jest.fn(() => [1])
	};
});

describe('enforcement notice formatter', () => {
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
			appealTypeCode: 'ENFORCEMENT',
			enforcementIssueDate: new Date(),
			enforcementEffectiveDate: new Date(),
			hasContactedPlanningInspectorate: true,
			contactPlanningInspectorateDate: new Date(),
			enforcementReferenceNumber: '12345',
			enforcementWhoIsAppealing: fieldValues.enforcementWhoIsAppealing.INDIVIDUAL,
			addNamedIndividual: null,
			selectedNamedIndividualId: null,
			enforcementOrganisationName: null,
			interestInAppealLand: 'owner',
			interestInAppealLand_interestInAppealLandDetails: null,
			hasPermissionToUseLand: null,
			allegedBreachDescription: 'Something was wrong',
			appealGrounds: 'a,b',
			applicationMadeAndFeePaid: true,
			uploadApplicationReceipt: true,
			applicationPartOrWholeDevelopment: 'all-of-the-development',
			applicationDecisionAppealed: false,
			appealDecisionDate: null,
			uploadPriorCorrespondence: null,
			uploadEnforcementNotice: true,
			uploadEnforcementNoticePlan: true,
			siteAddressIsContactAddress: true,
			appellantFirstName: 'Bob',
			appellantLastName: 'Bobberson',
			contactPhoneNumber: '0123456789',

			SubmissionIndividual: [],
			SubmissionAppealGround: [
				{
					groundName: 'a',
					facts: 'Ground a facts'
				},
				{
					groundName: 'b',
					facts: 'Ground b facts'
				}
			],

			onApplicationDate: new Date(),
			applicationReference: 'abc',
			applicationDecision: APPEAL_APPLICATION_DECISION.GRANTED,
			applicationDecisionDate: new Date(),
			appellantSiteAccess_appellantSiteAccessDetails: 'Access details',
			appellantSiteSafety_appellantSiteSafetyDetails: 'Safety details',

			developmentDescriptionOriginal: 'Original description',
			updateDevelopmentDescription: false,
			SubmissionLinkedCase: [{ caseReference: 'case123' }],
			costApplication: true,
			isAppellant: true,
			planningObligation: true,
			statusPlanningObligation: 'test',

			appellantProcedurePreference: 'inquiry',
			appellantPreferInquiryDetails: 'details',
			appellantPreferInquiryDuration: 13,
			appellantPreferInquiryWitnesses: 3
		};
	});

	it('should format the appellant submission correctly - individual', async () => {
		const result = await formatter(appellantSubmission, lpa);

		expect(result).toMatchObject({
			casedata: {
				submissionId: 'appeal123',
				caseType: APPEAL_CASE_TYPE.C,
				caseProcedure: APPEAL_CASE_PROCEDURE.WRITTEN,
				lpaCode: 123,
				caseSubmittedDate: expect.any(String),
				enforcementNotice: true,
				enforcementReference: appellantSubmission.enforcementReferenceNumber,
				enforcementIssueDate: expect.any(String),
				enforcementEffectiveDate: expect.any(String),
				contactPlanningInspectorateDate: expect.any(String),
				interestInLand: appellantSubmission.interestInAppealLand,
				writtenOrVerbalPermission: '',
				descriptionOfAllegedBreach: appellantSubmission.allegedBreachDescription,
				applicationMadeAndFeePaid: appellantSubmission.applicationMadeAndFeePaid,
				applicationDevelopmentAllOrPart: appellantSubmission.applicationPartOrWholeDevelopment,
				applicationReference: appellantSubmission.applicationReference,
				applicationDate: expect.any(String),
				applicationDecision: APPEAL_APPLICATION_DECISION.GRANTED,
				applicationDecisionDate: expect.any(String),
				applicationDecisionAppealed: false,
				appealDecisionDate: null,
				caseSubmissionDueDate: expect.any(String),
				siteAddressLine1: 'Line 1',
				siteAddressLine2: 'Line 2',
				siteAddressTown: 'Town',
				siteAddressCounty: 'County',
				siteAddressPostcode: 'Postcode',
				contactAddressLine1: undefined,
				contactAddressLine2: undefined,
				contactAddressTown: undefined,
				contactAddressCounty: undefined,
				contactAddressPostcode: undefined,
				siteAccessDetails: ['Access details'],
				siteSafetyDetails: ['Safety details'],
				originalDevelopmentDescription: 'Original description',
				changedDevelopmentDescription: false,
				nearbyCaseReferences: ['case123'],
				appellantCostsAppliedFor: true,
				appellantProcedurePreference: APPEAL_APPELLANT_PROCEDURE_PREFERENCE.INQUIRY,
				appellantProcedurePreferenceDetails: 'details',
				appellantProcedurePreferenceDuration: 13,
				appellantProcedurePreferenceWitnessCount: 3,
				planningObligation: true,
				statusPlanningObligation: 'test',
				namedIndividuals: [],
				appealGrounds: [
					{
						groundRef: 'a',
						factsForGround: 'Ground a facts'
					},
					{
						groundRef: 'b',
						factsForGround: 'Ground b facts'
					}
				]
			},
			documents: testDocuments,
			users: [
				{
					salutation: null,
					firstName: appellantSubmission.appellantFirstName,
					lastName: appellantSubmission.appellantLastName,
					emailAddress: appellantSubmission.Appeal.Users[0].AppealUser.email,
					serviceUserType: SERVICE_USER_TYPE.APPELLANT,
					telephoneNumber: appellantSubmission.contactPhoneNumber,
					organisation: null
				}
			]
		});
	});

	it('should format the appellant submission correctly - organisation', async () => {
		const organisationSubmission = {
			...appellantSubmission,
			enforcementWhoIsAppealing: fieldValues.enforcementWhoIsAppealing.ORGANISATION,
			addNamedIndividual: null,
			selectedNamedIndividualId: null,
			enforcementOrganisationName: 'Test Organisation LLP',
			contactFirstName: 'Organisation',
			contactLastName: 'Agent',
			contactCompanyName: 'Test Agents R Us'
		};

		const result = await formatter(organisationSubmission, lpa);

		expect(result).toMatchObject({
			casedata: {
				submissionId: 'appeal123',
				caseType: APPEAL_CASE_TYPE.C,
				caseProcedure: APPEAL_CASE_PROCEDURE.WRITTEN,
				lpaCode: 123,
				caseSubmittedDate: expect.any(String),
				enforcementNotice: true,
				enforcementReference: appellantSubmission.enforcementReferenceNumber,
				enforcementIssueDate: expect.any(String),
				enforcementEffectiveDate: expect.any(String),
				contactPlanningInspectorateDate: expect.any(String),
				interestInLand: appellantSubmission.interestInAppealLand,
				writtenOrVerbalPermission: '',
				descriptionOfAllegedBreach: appellantSubmission.allegedBreachDescription,
				applicationMadeAndFeePaid: appellantSubmission.applicationMadeAndFeePaid,
				applicationDevelopmentAllOrPart: appellantSubmission.applicationPartOrWholeDevelopment,
				applicationReference: appellantSubmission.applicationReference,
				applicationDate: expect.any(String),
				applicationDecision: APPEAL_APPLICATION_DECISION.GRANTED,
				applicationDecisionDate: expect.any(String),
				applicationDecisionAppealed: false,
				appealDecisionDate: null,
				caseSubmissionDueDate: expect.any(String),
				siteAddressLine1: 'Line 1',
				siteAddressLine2: 'Line 2',
				siteAddressTown: 'Town',
				siteAddressCounty: 'County',
				siteAddressPostcode: 'Postcode',
				contactAddressLine1: undefined,
				contactAddressLine2: undefined,
				contactAddressTown: undefined,
				contactAddressCounty: undefined,
				contactAddressPostcode: undefined,
				siteAccessDetails: ['Access details'],
				siteSafetyDetails: ['Safety details'],
				originalDevelopmentDescription: 'Original description',
				changedDevelopmentDescription: false,
				nearbyCaseReferences: ['case123'],
				appellantCostsAppliedFor: true,
				appellantProcedurePreference: APPEAL_APPELLANT_PROCEDURE_PREFERENCE.INQUIRY,
				appellantProcedurePreferenceDetails: 'details',
				appellantProcedurePreferenceDuration: 13,
				appellantProcedurePreferenceWitnessCount: 3,
				planningObligation: true,
				statusPlanningObligation: 'test',
				namedIndividuals: [],
				appealGrounds: [
					{
						groundRef: 'a',
						factsForGround: 'Ground a facts'
					},
					{
						groundRef: 'b',
						factsForGround: 'Ground b facts'
					}
				]
			},
			documents: testDocuments,
			users: [
				{
					salutation: null,
					firstName: null,
					lastName: null,
					emailAddress: null,
					serviceUserType: SERVICE_USER_TYPE.APPELLANT,
					telephoneNumber: appellantSubmission.contactPhoneNumber,
					organisation: organisationSubmission.enforcementOrganisationName
				},
				{
					salutation: null,
					firstName: organisationSubmission.contactFirstName,
					lastName: organisationSubmission.contactLastName,
					emailAddress: appellantSubmission.Appeal.Users[0].AppealUser.email,
					serviceUserType: SERVICE_USER_TYPE.AGENT,
					telephoneNumber: appellantSubmission.contactPhoneNumber,
					organisation: organisationSubmission.contactCompanyName
				}
			]
		});
	});

	it('should format the appellant submission correctly - group', async () => {
		const groupSubmission = {
			...appellantSubmission,
			enforcementWhoIsAppealing: fieldValues.enforcementWhoIsAppealing.GROUP,
			addNamedIndividual: true,
			selectedNamedIndividualId: '1',
			enforcementOrganisationName: null,
			SubmissionIndividual: [
				{
					id: '1',
					firstName: 'First',
					lastName: 'Individual',
					interestInAppealLand: 'owner',
					hasPermissionToUseLand: null
				},
				{
					id: '2',
					firstName: 'Second',
					lastName: 'Individual',
					interestInAppealLand: 'owner',
					hasPermissionToUseLand: null
				}
			]
		};

		const result = await formatter(groupSubmission, lpa);

		expect(result).toMatchObject({
			casedata: {
				submissionId: 'appeal123',
				caseType: APPEAL_CASE_TYPE.C,
				caseProcedure: APPEAL_CASE_PROCEDURE.WRITTEN,
				lpaCode: 123,
				caseSubmittedDate: expect.any(String),
				enforcementNotice: true,
				enforcementReference: appellantSubmission.enforcementReferenceNumber,
				enforcementIssueDate: expect.any(String),
				enforcementEffectiveDate: expect.any(String),
				contactPlanningInspectorateDate: expect.any(String),
				interestInLand: groupSubmission.SubmissionIndividual[0].interestInAppealLand,
				writtenOrVerbalPermission: '',
				descriptionOfAllegedBreach: appellantSubmission.allegedBreachDescription,
				applicationMadeAndFeePaid: appellantSubmission.applicationMadeAndFeePaid,
				applicationDevelopmentAllOrPart: appellantSubmission.applicationPartOrWholeDevelopment,
				applicationReference: appellantSubmission.applicationReference,
				applicationDate: expect.any(String),
				applicationDecision: APPEAL_APPLICATION_DECISION.GRANTED,
				applicationDecisionDate: expect.any(String),
				applicationDecisionAppealed: false,
				appealDecisionDate: null,
				caseSubmissionDueDate: expect.any(String),
				siteAddressLine1: 'Line 1',
				siteAddressLine2: 'Line 2',
				siteAddressTown: 'Town',
				siteAddressCounty: 'County',
				siteAddressPostcode: 'Postcode',
				contactAddressLine1: undefined,
				contactAddressLine2: undefined,
				contactAddressTown: undefined,
				contactAddressCounty: undefined,
				contactAddressPostcode: undefined,
				siteAccessDetails: ['Access details'],
				siteSafetyDetails: ['Safety details'],
				originalDevelopmentDescription: 'Original description',
				changedDevelopmentDescription: false,
				nearbyCaseReferences: ['case123'],
				appellantCostsAppliedFor: true,
				appellantProcedurePreference: APPEAL_APPELLANT_PROCEDURE_PREFERENCE.INQUIRY,
				appellantProcedurePreferenceDetails: 'details',
				appellantProcedurePreferenceDuration: 13,
				appellantProcedurePreferenceWitnessCount: 3,
				planningObligation: true,
				statusPlanningObligation: 'test',
				namedIndividuals: [
					{
						firstName: groupSubmission.SubmissionIndividual[1].firstName,
						lastName: groupSubmission.SubmissionIndividual[1].lastName,
						interestInLand: groupSubmission.SubmissionIndividual[1].interestInAppealLand,
						writtenOrVerbalPermission: ''
					}
				],
				appealGrounds: [
					{
						groundRef: 'a',
						factsForGround: 'Ground a facts'
					},
					{
						groundRef: 'b',
						factsForGround: 'Ground b facts'
					}
				]
			},
			documents: testDocuments,
			users: [
				{
					salutation: null,
					firstName: groupSubmission.SubmissionIndividual[0].firstName,
					lastName: groupSubmission.SubmissionIndividual[0].lastName,
					emailAddress: appellantSubmission.Appeal.Users[0].AppealUser.email,
					serviceUserType: SERVICE_USER_TYPE.APPELLANT,
					telephoneNumber: appellantSubmission.contactPhoneNumber,
					organisation: null
				}
			]
		});
	});

	it('should throw an error if appellantSubmission is not provided', async () => {
		await expect(formatter(null)).rejects.toThrow();
	});
});
