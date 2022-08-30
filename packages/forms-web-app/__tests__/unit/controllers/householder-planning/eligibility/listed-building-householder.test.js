const appeal = require('@pins/business-rules/test/data/householder-appeal');
const {
	getListedBuildingHouseholder,
	postListedBuildingHouseholder
} = require('../../../../../src/controllers/householder-planning/eligibility/listed-building-householder');
const { createOrUpdateAppeal } = require('../../../../../src/lib/appeals-api-wrapper');
const logger = require('../../../../../src/lib/logger');
const {
	VIEW: {
		HOUSEHOLDER_PLANNING: {
			ELIGIBILITY: { LISTED_BUILDING_HOUSEHOLDER }
		}
	}
} = require('../../../../../src/lib/views');

const { mockReq, mockRes } = require('../../../mocks');

jest.mock('../../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../../src/lib/logger');

describe('controllers/householder-planning/eligibility/listed-building-householder', () => {
	let req;
	let res;

	beforeEach(() => {
		req = mockReq(appeal);
		res = mockRes();

		jest.resetAllMocks();
	});

	describe('getListedBuildingHouseholder', () => {
		it('should call the correct template on getListedBuildingHouseholder', async () => {
			await getListedBuildingHouseholder(req, res);

			expect(res.render).toBeCalledWith(LISTED_BUILDING_HOUSEHOLDER, {
				isListedBuilding: appeal.eligibility.isListedBuilding,
				typeOfPlanningApplication: 'householder-planning'
			});
		});
	});

	describe('postListedBuildingHouseholder', () => {
		it(`should redirect to the use-existing-service-listed-building page if 'yes' is selected`, async () => {
			const mockRequest = {
				...req,
				body: { 'listed-building-householder': 'yes' }
			};

			await postListedBuildingHouseholder(mockRequest, res);

			expect(appeal.eligibility.isListedBuilding).toEqual(true);
			expect(createOrUpdateAppeal).toHaveBeenCalledWith({ ...appeal });

			expect(res.redirect).toBeCalledWith('/before-you-start/use-existing-service-listed-building');
		});

		it(`should redirect to the granted-or-refused-householder page if 'no' is selected`, async () => {
			const mockRequest = {
				...req,
				body: { 'listed-building-householder': 'no' }
			};

			await postListedBuildingHouseholder(mockRequest, res);

			expect(appeal.eligibility.isListedBuilding).toEqual(false);
			expect(createOrUpdateAppeal).toHaveBeenCalledWith({
				...appeal
			});

			expect(res.redirect).toBeCalledWith(LISTED_BUILDING_HOUSEHOLDER);
		});

		it('should re-render the template with errors if there is any validation error', async () => {
			const mockRequest = {
				...req,
				body: {
					errors: {
						'listed-building-householder': {
							msg: 'Select yes if your appeal about a listed building'
						}
					}
				}
			};

			await postListedBuildingHouseholder(mockRequest, res);

			expect(createOrUpdateAppeal).not.toHaveBeenCalled();

			expect(res.render).toBeCalledWith(LISTED_BUILDING_HOUSEHOLDER, {
				isListedBuilding: appeal.eligibility.isListedBuilding,
				typeOfPlanningApplication: 'householder-planning',
				errors: {
					'listed-building-householder': {
						msg: 'Select yes if your appeal about a listed building'
					}
				},
				errorSummary: []
			});
		});

		it('should re-render the template with errors if there is any api call error', async () => {
			const error = new Error('API is down');

			const mockRequest = {
				...req,
				body: { 'listed-building-householder': 'outline-planning' }
			};

			createOrUpdateAppeal.mockImplementation(() => Promise.reject(error));

			await postListedBuildingHouseholder(mockRequest, res);

			expect(res.redirect).not.toHaveBeenCalled();
			expect(logger.error).toHaveBeenCalledWith(error);

			expect(res.render).toHaveBeenCalledWith(LISTED_BUILDING_HOUSEHOLDER, {
				isListedBuilding: appeal.eligibility.isListedBuilding,
				typeOfPlanningApplication: 'householder-planning',
				errors: {},
				errorSummary: [{ text: error.toString(), href: '#' }]
			});
		});
	});
});
