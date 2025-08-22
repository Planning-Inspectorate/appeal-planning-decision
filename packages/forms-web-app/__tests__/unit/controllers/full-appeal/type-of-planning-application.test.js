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
		TYPE_OF_PLANNING_APPLICATION: { MINOR_COMMERCIAL_DEVELOPMENT, ADVERTISEMENT }
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
		it('should call the correct template on getTypeOfPlanningApplication - v1', async () => {
			isLpaInFeatureFlag.mockReturnValue(false);
			typeOfPlanningApplicationRadioItems.mockReturnValueOnce(mockRadioItems);
			await getTypeOfPlanningApplication(req, res);

			expect(typeOfPlanningApplicationRadioItems).toHaveBeenCalledWith(
				false,
				false,
				false,
				false,
				'full-appeal'
			);
			expect(res.render).toHaveBeenCalledWith(TYPE_OF_PLANNING_APPLICATION, {
				typeOfPlanningApplication: 'full-appeal',
				radioItems: mockRadioItems
			});
		});

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

		it('should redirect to the listed building page if HAS', async () => {
			const planningApplication = 'householder-planning';
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

			expect(res.redirect).toHaveBeenCalledWith('/before-you-start/listed-building-householder');
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

		const defaultTypes = ['outline-planning', 'full-appeal', 'reserved-matters'];

		it.each(defaultTypes)(
			'should redirect to the any-of-following page if %s - v1',
			async (type) => {
				isLpaInFeatureFlag.mockReturnValueOnce(false); // s20
				isLpaInFeatureFlag.mockReturnValueOnce(false); // s78
				const planningApplication = type;

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

				expect(res.redirect).toHaveBeenCalledWith('/before-you-start/any-of-following');
			}
		);

		it.each(defaultTypes)(
			'should redirect to the listed-building page if %s - v2 (s78 flag only)',
			async (type) => {
				isLpaInFeatureFlag.mockImplementation((_, flag) => {
					return flag === FLAG.S78_APPEAL_FORM_V2;
				});

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

				expect(createOrUpdateAppeal).toHaveBeenCalledWith({
					...updatedAppeal
				});

				expect(res.redirect).toHaveBeenCalledWith('/before-you-start/listed-building');
			}
		);

		it.each(defaultTypes)(
			'should redirect to the granted-or-refused page if %s - v2 (s20 flag only)',
			async (type) => {
				isLpaInFeatureFlag.mockImplementation((_, flag) => {
					return flag === FLAG.S20_APPEAL_FORM_V2;
				});

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
				updatedAppeal.eligibility.isListedBuilding = false;

				expect(createOrUpdateAppeal).toHaveBeenCalledWith({
					...updatedAppeal
				});

				expect(res.redirect).toHaveBeenCalledWith('/before-you-start/granted-or-refused');
			}
		);

		it.each(defaultTypes)(
			'should redirect to the granted-or-refused page if %s - v2 (s20 & s78 flags)',
			async (type) => {
				isLpaInFeatureFlag.mockImplementation((_, flag) => {
					return flag === FLAG.S20_APPEAL_FORM_V2 || flag === FLAG.S78_APPEAL_FORM_V2;
				});
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
				updatedAppeal.eligibility.isListedBuilding = false;

				expect(createOrUpdateAppeal).toHaveBeenCalledWith({
					...updatedAppeal
				});

				expect(res.redirect).toHaveBeenCalledWith('/before-you-start/granted-or-refused');
			}
		);

		it('should redirect to the prior approval page', async () => {
			const planningApplication = 'prior-approval';

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
			const planningApplication = 'removal-or-variation-of-conditions';

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
				'/before-you-start/conditions-householder-permission'
			);
		});

		it('should redirect to the removal or variation of conditions page - s20', async () => {
			isLpaInFeatureFlag.mockImplementation((_, flag) => {
				return flag === FLAG.S20_APPEAL_FORM_V2;
			});

			const planningApplication = 'removal-or-variation-of-conditions';

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

			expect(createOrUpdateAppeal).toHaveBeenCalledWith({
				...updatedAppeal
			});

			expect(res.redirect).toHaveBeenCalledWith('/before-you-start/planning-application-about');
		});

		it('should redirect to the granted-or-refused page - cas adverts', async () => {
			isLpaInFeatureFlag.mockImplementation((_, flag) => {
				return flag === FLAG.CAS_ADVERTS_APPEAL_FORM_V2;
			});

			const planningApplication = ADVERTISEMENT;

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

			expect(res.redirect).toHaveBeenCalledWith('/before-you-start/granted-or-refused');
		});

		it('should redirect to the granted-or-refused page - adverts', async () => {
			isLpaInFeatureFlag.mockImplementation((_, flag) => {
				return flag === FLAG.ADVERTS_APPEAL_FORM_V2;
			});

			const planningApplication = ADVERTISEMENT;

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

			expect(res.redirect).toHaveBeenCalledWith('/before-you-start/granted-or-refused');
		});

		it('should redirect to granted-or-refused page if listed-building selected (v2 only)', async () => {
			isLpaInFeatureFlag.mockImplementation((_, flag) => {
				return flag === FLAG.S20_APPEAL_FORM_V2;
			});
			const planningApplication = 'listed-building';

			const mockRequest = {
				...req,
				body: { 'type-of-planning-application': planningApplication }
			};

			await postTypeOfPlanningApplication(mockRequest, res);

			const updatedAppeal = appeal;
			updatedAppeal.appealType = mapPlanningApplication(planningApplication);
			updatedAppeal.typeOfPlanningApplication = planningApplication;
			updatedAppeal.eligibility.isListedBuilding = true;

			expect(createOrUpdateAppeal).toHaveBeenCalledWith({
				...updatedAppeal
			});

			expect(res.redirect).toHaveBeenCalledWith('/before-you-start/granted-or-refused');
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
				body: { 'type-of-planning-application': 'outline-planning' }
			};
			mockRequest.session.appeal.typeOfPlanningApplication = null;

			createOrUpdateAppeal.mockImplementation(() => Promise.reject(error));

			await postTypeOfPlanningApplication(mockRequest, res);

			expect(res.redirect).not.toHaveBeenCalled();
			expect(logger.error).toHaveBeenCalledWith(error);

			expect(res.render).toHaveBeenCalledWith(TYPE_OF_PLANNING_APPLICATION, {
				typeOfPlanningApplication: 'outline-planning',
				radioItems: mockRadioItems,
				errors: {},
				errorSummary: [{ text: error.toString(), href: '#' }]
			});
		});
	});
});
