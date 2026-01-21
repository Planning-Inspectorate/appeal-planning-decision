const v8 = require('v8');
const {
	getTypeOfPlanningApplication,
	postTypeOfPlanningApplication
} = require('../../../../src/controllers/full-appeal/type-of-planning-application');
const { createOrUpdateAppeal } = require('../../../../src/lib/appeals-api-wrapper');
const logger = require('../../../../src/lib/logger');
const {
	VIEW: {
		FULL_APPEAL: { TYPE_OF_PLANNING_APPLICATION }
	}
} = require('../../../../src/lib/views');
const { mockReq, mockRes } = require('../../mocks');
const {
	mapPlanningApplication
} = require('../../../../src/lib/full-appeal/map-planning-application');
const { isLpaInFeatureFlag } = require('#lib/is-lpa-in-feature-flag');
const {
	typeOfPlanningApplicationRadioItems
} = require('#lib/type-of-planning-application-radio-items');
const { FLAG } = require('@pins/common/src/feature-flags');
const {
	constants: {
		TYPE_OF_PLANNING_APPLICATION: {
			FULL_APPEAL,
			OUTLINE_PLANNING,
			RESERVED_MATTERS,
			LISTED_BUILDING,
			MINOR_COMMERCIAL_DEVELOPMENT,
			ADVERTISEMENT,
			LAWFUL_DEVELOPMENT_CERTIFICATE,
			PRIOR_APPROVAL,
			REMOVAL_OR_VARIATION_OF_CONDITIONS
		}
	}
} = require('@pins/business-rules');

const mockRadioItems = [
	{
		value: 'test',
		text: 'test'
	}
];

jest.mock('../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../src/lib/logger');
jest.mock('../../../../src/lib/is-lpa-in-feature-flag');
jest.mock('../../../../src/lib/type-of-planning-application-radio-items');

describe('controllers/full-appeal/type-of-planning-application', () => {
	let req;
	let res;
	let appeal;

	beforeEach(() => {
		appeal = require('@pins/business-rules/test/data/full-appeal');
		req = v8.deserialize(v8.serialize(mockReq(appeal)));
		res = mockRes();

		jest.resetAllMocks();
	});

	describe('Type of Planning Application Controller Tests', () => {
		it('should call the correct template on getTypeOfPlanningApplication - v2', async () => {
			isLpaInFeatureFlag.mockReturnValue(true);
			typeOfPlanningApplicationRadioItems.mockReturnValueOnce(mockRadioItems);
			await getTypeOfPlanningApplication(req, res);

			expect(typeOfPlanningApplicationRadioItems).toHaveBeenCalledWith(
				true,
				true,
				true,
				true,
				'full-appeal'
			);
			expect(res.render).toHaveBeenCalledWith(TYPE_OF_PLANNING_APPLICATION, {
				typeOfPlanningApplication: 'full-appeal',
				radioItems: mockRadioItems
			});
		});

		it('should redirect to the listed building page if HAS - v2 (s20 flag)', async () => {
			isLpaInFeatureFlag.mockReturnValueOnce(true); //s20

			const planningApplication = 'householder-planning';
			const mockRequest = {
				...req,
				body: { 'type-of-planning-application': planningApplication }
			};

			await postTypeOfPlanningApplication(mockRequest, res);

			const updatedAppeal = appeal;
			updatedAppeal.appealType = mapPlanningApplication(planningApplication);
			updatedAppeal.typeOfPlanningApplication = planningApplication;
			updatedAppeal.eligibility.isListedBuilding = false;

			expect(createOrUpdateAppeal).toHaveBeenCalledWith({
				...updatedAppeal
			});

			expect(res.redirect).toHaveBeenCalledWith('/before-you-start/granted-or-refused-householder');
		});

		it('should redirect to the shutter page if something-else', async () => {
			const planningApplication = 'something-else';

			const mockRequest = {
				...req,
				body: { 'type-of-planning-application': planningApplication }
			};

			await postTypeOfPlanningApplication(mockRequest, res);

			const updatedAppeal = appeal;
			updatedAppeal.appealType = mapPlanningApplication(planningApplication);
			updatedAppeal.typeOfPlanningApplication = planningApplication;

			expect(createOrUpdateAppeal).toHaveBeenCalledWith({
				...updatedAppeal
			});

			expect(res.redirect).toHaveBeenCalledWith(
				'/before-you-start/use-existing-service-application-type'
			);
		});

		it('should redirect to the shutter page if i-have-not-made-a-planning-application', async () => {
			const planningApplication = 'i-have-not-made-a-planning-application';

			const mockRequest = {
				...req,
				body: { 'type-of-planning-application': 'i-have-not-made-a-planning-application' }
			};

			await postTypeOfPlanningApplication(mockRequest, res);

			const updatedAppeal = appeal;
			updatedAppeal.appealType = mapPlanningApplication(planningApplication);
			updatedAppeal.typeOfPlanningApplication = planningApplication;

			expect(createOrUpdateAppeal).toHaveBeenCalledWith({
				...updatedAppeal
			});

			expect(res.redirect).toHaveBeenCalledWith(
				'/before-you-start/use-existing-service-application-type'
			);
		});

		const defaultTypes = [OUTLINE_PLANNING, FULL_APPEAL, RESERVED_MATTERS, LISTED_BUILDING];

		it.each(defaultTypes)('should redirect to the granted-or-refused page if %s', async (type) => {
			typeOfPlanningApplicationRadioItems.mockReturnValueOnce(mockRadioItems);
			const planningApplication = type;

			const mockRequest = {
				...req,
				body: { 'type-of-planning-application': planningApplication }
			};

			await postTypeOfPlanningApplication(mockRequest, res);

			const updatedAppeal = appeal;
			updatedAppeal.appealType = mapPlanningApplication(planningApplication);
			updatedAppeal.typeOfPlanningApplication = planningApplication;
			updatedAppeal.eligibility.isListedBuilding = type === LISTED_BUILDING;

			expect(createOrUpdateAppeal).toHaveBeenCalledWith({
				...updatedAppeal
			});

			expect(res.redirect).toHaveBeenCalledWith('/before-you-start/granted-or-refused');
		});

		const defaultFeatureFlaggedTypes = [
			['cas advert', ADVERTISEMENT, FLAG.CAS_ADVERTS_APPEAL_FORM_V2],
			['advert', ADVERTISEMENT, FLAG.ADVERTS_APPEAL_FORM_V2]
		];

		it.each(defaultFeatureFlaggedTypes)(
			'should redirect to the granted-or-refused page if %s',
			async (_, type, appealTypeFlag) => {
				isLpaInFeatureFlag.mockImplementation((_, flag) => {
					return flag === appealTypeFlag;
				});

				const planningApplication = type;

				const mockRequest = {
					...req,
					body: { 'type-of-planning-application': planningApplication }
				};

				await postTypeOfPlanningApplication(mockRequest, res);

				const updatedAppeal = appeal;
				updatedAppeal.appealType = mapPlanningApplication(planningApplication);
				updatedAppeal.typeOfPlanningApplication = planningApplication;
				updatedAppeal.eligibility.isListedBuilding = false;

				expect(createOrUpdateAppeal).toHaveBeenCalledWith({
					...updatedAppeal
				});

				expect(res.redirect).toHaveBeenCalledWith('/before-you-start/granted-or-refused');
			}
		);

		it('should redirect to the prior approval page', async () => {
			const planningApplication = PRIOR_APPROVAL;

			const mockRequest = {
				...req,
				body: { 'type-of-planning-application': planningApplication }
			};

			await postTypeOfPlanningApplication(mockRequest, res);

			const updatedAppeal = appeal;
			updatedAppeal.appealType = mapPlanningApplication(planningApplication);
			updatedAppeal.typeOfPlanningApplication = planningApplication;

			expect(createOrUpdateAppeal).toHaveBeenCalledWith({
				...updatedAppeal
			});

			expect(res.redirect).toHaveBeenCalledWith('/before-you-start/prior-approval-existing-home');
		});

		it('should redirect to the removal or variation of conditions page', async () => {
			const planningApplication = REMOVAL_OR_VARIATION_OF_CONDITIONS;

			const mockRequest = {
				...req,
				body: { 'type-of-planning-application': planningApplication }
			};

			await postTypeOfPlanningApplication(mockRequest, res);

			const updatedAppeal = appeal;
			updatedAppeal.appealType = mapPlanningApplication(planningApplication);
			updatedAppeal.typeOfPlanningApplication = planningApplication;
			updatedAppeal.eligibility.isListedBuilding = null;

			expect(createOrUpdateAppeal).toHaveBeenCalledWith({
				...updatedAppeal
			});

			expect(res.redirect).toHaveBeenCalledWith(
				'/before-you-start/conditions-householder-permission'
			);
		});

		it('should redirect to the application about page - cas planning', async () => {
			isLpaInFeatureFlag.mockImplementation((_, flag) => {
				return flag === FLAG.CAS_PLANNING_APPEAL_FORM_V2;
			});

			const planningApplication = MINOR_COMMERCIAL_DEVELOPMENT;

			const mockRequest = {
				...req,
				body: { 'type-of-planning-application': planningApplication }
			};

			await postTypeOfPlanningApplication(mockRequest, res);

			const updatedAppeal = appeal;
			updatedAppeal.appealType = mapPlanningApplication(planningApplication);
			updatedAppeal.typeOfPlanningApplication = planningApplication;
			updatedAppeal.eligibility.isListedBuilding = false;

			expect(createOrUpdateAppeal).toHaveBeenCalledWith({
				...updatedAppeal
			});

			expect(res.redirect).toHaveBeenCalledWith('/before-you-start/planning-application-about');
		});

		it('should redirect to the listed building page - ldc', async () => {
			isLpaInFeatureFlag.mockImplementation((_, flag) => {
				return flag === FLAG.LDC_APPEAL_FORM_V2;
			});

			const planningApplication = LAWFUL_DEVELOPMENT_CERTIFICATE;

			const mockRequest = {
				...req,
				body: { 'type-of-planning-application': planningApplication }
			};

			await postTypeOfPlanningApplication(mockRequest, res);

			const updatedAppeal = appeal;
			updatedAppeal.appealType = mapPlanningApplication(planningApplication);
			updatedAppeal.typeOfPlanningApplication = planningApplication;
			updatedAppeal.eligibility.isListedBuilding = null;

			expect(createOrUpdateAppeal).toHaveBeenCalledWith({
				...updatedAppeal
			});

			expect(res.redirect).toHaveBeenCalledWith('/before-you-start/listed-building');
		});

		it('should render errors on the page', async () => {
			typeOfPlanningApplicationRadioItems.mockReturnValueOnce(mockRadioItems);
			const mockRequest = {
				...req,
				body: {
					errors: {
						'type-of-planning-application': {
							msg: 'Select which type of planning application your appeal is about, or if you have not made a planning application'
						}
					}
				}
			};
			mockRequest.session.appeal.typeOfPlanningApplication = null;

			await postTypeOfPlanningApplication(mockRequest, res);

			expect(createOrUpdateAppeal).not.toHaveBeenCalled();

			expect(res.render).toHaveBeenCalledWith(TYPE_OF_PLANNING_APPLICATION, {
				typeOfPlanningApplication: undefined,
				radioItems: mockRadioItems,
				errors: {
					'type-of-planning-application': {
						msg: 'Select which type of planning application your appeal is about, or if you have not made a planning application'
					}
				},
				errorSummary: []
			});
		});

		it('should render page with failed appeal update message', async () => {
			typeOfPlanningApplicationRadioItems.mockReturnValueOnce(mockRadioItems);
			const error = new Error('API is down');

			const mockRequest = {
				...req,
				body: { 'type-of-planning-application': OUTLINE_PLANNING }
			};
			mockRequest.session.appeal.typeOfPlanningApplication = null;

			createOrUpdateAppeal.mockImplementation(() => Promise.reject(error));

			await postTypeOfPlanningApplication(mockRequest, res);

			expect(res.redirect).not.toHaveBeenCalled();
			expect(logger.error).toHaveBeenCalledWith(error);

			expect(res.render).toHaveBeenCalledWith(TYPE_OF_PLANNING_APPLICATION, {
				typeOfPlanningApplication: OUTLINE_PLANNING,
				radioItems: mockRadioItems,
				errors: {},
				errorSummary: [{ text: error.toString(), href: '#' }]
			});
		});
	});
});
