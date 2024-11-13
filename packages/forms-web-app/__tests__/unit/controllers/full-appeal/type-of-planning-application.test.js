const appeal = require('@pins/business-rules/test/data/full-appeal');
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
const config = require('../../../../src/config');

jest.mock('../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../src/lib/logger');

describe('controllers/full-appeal/type-of-planning-application', () => {
	let req;
	let res;

	beforeEach(() => {
		req = v8.deserialize(v8.serialize(mockReq(appeal)));
		res = mockRes();

		jest.resetAllMocks();
	});

	describe('Type of Planning Application Controller Tests', () => {
		it('should call the correct template on getTypeOfPlanningApplication', async () => {
			await getTypeOfPlanningApplication(req, res);

			expect(res.render).toBeCalledWith(TYPE_OF_PLANNING_APPLICATION, {
				bannerHtmlOverride: config.betaBannerText,
				typeOfPlanningApplication: 'full-appeal'
			});
		});

		it('should redirect to the listed building page', async () => {
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

			expect(res.redirect).toBeCalledWith('/before-you-start/listed-building-householder');
		});

		it('should redirect to the shutter page', async () => {
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

			expect(res.redirect).toBeCalledWith(
				'/before-you-start/use-existing-service-application-type'
			);
		});

		it('should redirect to the shutter page', async () => {
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

			expect(res.redirect).toBeCalledWith(
				'/before-you-start/use-existing-service-application-type'
			);
		});

		it('should redirect to the about appeal page', async () => {
			const planningApplication = 'outline-planning';

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

			expect(res.redirect).toBeCalledWith('/before-you-start/any-of-following');
		});

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

			expect(res.redirect).toBeCalledWith('/before-you-start/prior-approval-existing-home');
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

			expect(res.redirect).toBeCalledWith('/before-you-start/conditions-householder-permission');
		});

		it('should render errors on the page', async () => {
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

			expect(res.render).toBeCalledWith(TYPE_OF_PLANNING_APPLICATION, {
				bannerHtmlOverride: config.betaBannerText,
				typeOfPlanningApplication: undefined,
				errors: {
					'type-of-planning-application': {
						msg: 'Select which type of planning application your appeal is about, or if you have not made a planning application'
					}
				},
				errorSummary: []
			});
		});

		it('should render page with failed appeal update message', async () => {
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
				bannerHtmlOverride: config.betaBannerText,
				typeOfPlanningApplication: 'outline-planning',
				errors: {},
				errorSummary: [{ text: error.toString(), href: '#' }]
			});
		});
	});
});
