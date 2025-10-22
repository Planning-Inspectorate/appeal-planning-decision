const LpaEntity = require('../../../../models/entities/lpa-entity');
const { formatter } = require(`./appeal`);
const {
	APPEAL_APPLICATION_DECISION,
	APPEAL_CASE_PROCEDURE,
	APPEAL_CASE_TYPE,
	APPEAL_TYPE_OF_PLANNING_APPLICATION,
	SERVICE_USER_TYPE
} = require('@planning-inspectorate/data-model');

jest.mock('../../../../services/object-store');

// Mock getDocuments
jest.mock('../utils', () => {
	const originalModule = jest.requireActual('../utils');
	return {
		...originalModule,
		getDocuments: jest.fn(() => [1])
	};
});

describe('Adverts formatter', () => {
	/**
	 * @type {import('../utils').FullAppellantSubmission}
	 */
	let appellantSubmission;
	const lpa = new LpaEntity(123, 123, 123, 123, 'name', 'email', 'domain', true);

	beforeEach(() => {
		jest.clearAllMocks();
		appellantSubmission = {
			SubmissionDocumentUpload: [],
			SubmissionListedBuilding: [],
			LPACode: '123',
			SubmissionAddress: [
				{
					id: 'addr1',
					questionnaireId: null,
					appellantSubmissionId: 'appeal123',
					fieldName: 'siteAddress',
					addressLine1: 'Line 1',
					addressLine2: 'Line 2',
					townCity: 'Town',
					county: 'County',
					postcode: 'Postcode'
				}
			],
			Appeal: {
				id: 'appeal123',
				legacyAppealSubmissionId: null,
				legacyAppealSubmissionDecisionDate: null,
				legacyAppealSubmissionState: null,
				Users: [
					{
						AppealUser: {
							id: 'user1',
							email: 'email',
							isEnrolled: true,
							isLpaUser: false,
							lpaCode: null,
							isLpaAdmin: null,
							lpaStatus: null
						},
						id: 'appealUser1',
						appealId: 'appeal123',
						userId: 'user1',
						role: 'appellant'
					}
				]
			},
			appealId: 'appeal123',
			appealTypeCode: 'CAS_ADVERTS',
			onApplicationDate: new Date(),
			applicationDecision: APPEAL_APPLICATION_DECISION.GRANTED,
			applicationDecisionDate: new Date(),
			appellantSiteAccess_appellantSiteAccessDetails: 'Access details',
			appellantSiteSafety_appellantSiteSafetyDetails: 'Safety details',
			appellantGreenBelt: true,
			siteAreaSquareMetres: /** @type {any} */ (100),
			ownsAllLand: true,
			ownsSomeLand: false,
			knowsOtherOwners: 'yes',
			knowsAllOwners: 'no',
			advertisedAppeal: true,
			informedOwners: true,
			developmentDescriptionOriginal: 'Original description',
			updateDevelopmentDescription: true,
			SubmissionLinkedCase: [
				{
					id: 'linked1',
					appellantSubmissionId: 'appeal123',
					fieldName: 'nearbyCaseReferences',
					lPAQuestionnaireSubmissionId: null,
					caseReference: 'case123'
				}
			],
			costApplication: true,
			isAppellant: true,
			typeOfPlanningApplication: APPEAL_TYPE_OF_PLANNING_APPLICATION.OUTLINE_PLANNING,
			advertInPosition: true,
			highwayLand: true,
			landownerPermission: true
		};
	});

	it.each([
		['CAS_ADVERTS', APPEAL_CASE_TYPE.ZA, { useGridRef: true }],
		['CAS_ADVERTS', APPEAL_CASE_TYPE.ZA, { useGridRef: false }],
		['ADVERTS', APPEAL_CASE_TYPE.H, { useGridRef: true }],
		['ADVERTS', APPEAL_CASE_TYPE.H, { useGridRef: false }]
	])(
		'formats appellant submission for appealTypeCode %s',
		async (appealTypeCode, expectedCaseType, options) => {
			const submission = { ...appellantSubmission, appealTypeCode };
			if (options.useGridRef) {
				delete submission.SubmissionAddress;
				submission.siteGridReferenceEasting = '359608';
				submission.siteGridReferenceNorthing = '172607';
			}
			const result = await formatter(submission, lpa);
			expect(result.casedata.caseType).toEqual(expectedCaseType);
			expect(result.casedata).toMatchObject({
				submissionId: 'appeal123',
				caseProcedure: APPEAL_CASE_PROCEDURE.WRITTEN,
				lpaCode: 123,
				isGreenBelt: true,
				siteAreaSquareMetres: 100,
				floorSpaceSquareMetres: 100,
				hasLandownersPermission: true,
				isAdvertInPosition: true,
				isSiteOnHighwayLand: true,
				ownsAllLand: true,
				ownsSomeLand: false,
				knowsOtherOwners: 'Yes',
				knowsAllOwners: 'No',
				advertisedAppeal: true,
				ownersInformed: true,
				originalDevelopmentDescription: 'Original description',
				changedDevelopmentDescription: true,
				nearbyCaseReferences: ['case123'],
				appellantCostsAppliedFor: true,
				typeOfPlanningApplication: APPEAL_TYPE_OF_PLANNING_APPLICATION.OUTLINE_PLANNING
			});

			if (options.useGridRef) {
				expect(result.casedata).toMatchObject({
					siteGridReferenceEasting: submission.siteGridReferenceEasting,
					siteGridReferenceNorthing: submission.siteGridReferenceNorthing
				});
			} else {
				expect(result.casedata).toMatchObject({
					siteAddressLine1: submission.SubmissionAddress[0].addressLine1,
					siteAddressLine2: submission.SubmissionAddress[0].addressLine2,
					siteAddressTown: submission.SubmissionAddress[0].townCity,
					siteAddressCounty: submission.SubmissionAddress[0].county,
					siteAddressPostcode: submission.SubmissionAddress[0].postcode
				});
			}
			expect(result.users[0]).toMatchObject({
				serviceUserType: SERVICE_USER_TYPE.APPELLANT
			});
		}
	);

	it.each([
		['CAS_ADVERTS', APPEAL_CASE_TYPE.ZA],
		['ADVERTS', APPEAL_CASE_TYPE.H]
	])('formats agent submission for appealTypeCode %s', async (appealTypeCode, expectedCaseType) => {
		const submission = {
			...appellantSubmission,
			appealTypeCode,
			isAppellant: false,
			appellantFirstName: 'bob',
			appellantLastName: 'test',
			appellantCompanyName: 'test co.'
		};
		const result = await formatter(submission, lpa);
		expect(result.casedata.caseType).toEqual(expectedCaseType);
		expect(result.users).toHaveLength(2);
		expect(result.users[0].serviceUserType).toBe(SERVICE_USER_TYPE.AGENT);
		expect(result.users[1]).toMatchObject({
			serviceUserType: SERVICE_USER_TYPE.APPELLANT,
			organisation: 'test co.'
		});
	});

	it('should throw an error if appellantSubmission is not provided', async () => {
		await expect(formatter(null, lpa)).rejects.toThrow();
	});

	it('should throw an error for unsupported appealTypeCode', async () => {
		await expect(formatter({ appealTypeCode: 'UNSUPPORTED' }, lpa)).rejects.toThrow();
	});
});
