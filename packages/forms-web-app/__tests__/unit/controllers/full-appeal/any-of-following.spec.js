const appeal = require('@pins/business-rules/test/data/full-appeal');
const v8 = require('v8');
const {
	postAnyOfFollowing,
	getAnyOfFollowing
} = require('../../../../src/controllers/full-appeal/any-of-following');
const { mockReq, mockRes } = require('../../mocks');
const { createOrUpdateAppeal } = require('../../../../src/lib/appeals-api-wrapper');
const {
	VIEW: {
		FULL_APPEAL: { ANY_OF_FOLLOWING }
	}
} = require('../../../../src/lib/views');
const config = require('../../../../src/config');

jest.mock('../../../../src/lib/logger');
jest.mock('../../../../src/lib/appeals-api-wrapper');

describe('controllers/full-appeal/any-of-following', () => {
	let req;
	let res;

	beforeEach(() => {
		req = v8.deserialize(v8.serialize(mockReq(appeal)));
		res = mockRes();

		jest.resetAllMocks();
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	it('should render any of following page', () => {
		getAnyOfFollowing(req, res);

		expect(res.render).toHaveBeenCalledWith(ANY_OF_FOLLOWING, {
			bannerHtmlOverride: config.betaBannerText,
			applicationCategories: ['none_of_these'],
			typeOfPlanningApplication: 'full-appeal'
		});
	});

	describe('postAnyOfFollowing', () => {
		it('should re-render the template with errors if option is not selected', async () => {
			const mockRequest = {
				...req,
				body: {
					errors: {
						'any-of-following': {
							msg: 'Select if your appeal is about any of the following'
						}
					},
					errorSummary: [{ text: 'Select if your appeal is about any of the following' }]
				}
			};

			await postAnyOfFollowing(mockRequest, res);

			expect(res.render).toHaveBeenCalledWith(ANY_OF_FOLLOWING, {
				bannerHtmlOverride: config.betaBannerText,
				applicationCategories: undefined,
				typeOfPlanningApplication: 'full-appeal',
				errorSummary: [{ text: 'Select if your appeal is about any of the following' }],
				errors: {
					'any-of-following': {
						msg: 'Select if your appeal is about any of the following'
					}
				}
			});
		});

		it('should send user to shutter page when choosing wrong single option', async () => {
			const mockRequest = {
				...req,
				body: {
					'any-of-following': 'a_listed_building'
				}
			};

			await postAnyOfFollowing(mockRequest, res);
			expect(res.redirect).toHaveBeenCalledWith(
				'/before-you-start/use-existing-service-development-type'
			);
		});

		it('should send user to shutter page when choosing wrong multiple options', async () => {
			const mockRequest = {
				...req,
				body: {
					'any-of-following': ['a_listed_building', 'major_dwellings']
				}
			};

			await postAnyOfFollowing(mockRequest, res);
			expect(res.redirect).toHaveBeenCalledWith(
				'/before-you-start/use-existing-service-development-type'
			);
		});

		it('should send user to shutter page when sending invalid inputs', async () => {
			const mockRequest = {
				...req,
				body: {
					'any-of-following': [undefined, undefined]
				}
			};

			await postAnyOfFollowing(mockRequest, res);
			expect(res.redirect).toHaveBeenCalledWith(
				'/before-you-start/use-existing-service-development-type'
			);
		});

		it('should send user to enforcement page when choosing none of these option', async () => {
			const mockRequest = {
				...req,
				body: {
					'any-of-following': 'none_of_these'
				}
			};

			await postAnyOfFollowing(mockRequest, res);
			expect(res.redirect).toHaveBeenCalledWith('/before-you-start/granted-or-refused');
		});

		it('should re-render the template with errors if an error is thrown', async () => {
			const error = new Error('Internal Server Error');

			req = {
				...req,
				body: { 'any-of-following': 'none_of_these' }
			};

			createOrUpdateAppeal.mockImplementation(() => {
				throw error;
			});

			await postAnyOfFollowing(req, res);

			expect(res.redirect).not.toHaveBeenCalled();
			expect(res.render).toHaveBeenCalledTimes(1);
			expect(res.render).toHaveBeenCalledWith(ANY_OF_FOLLOWING, {
				bannerHtmlOverride: config.betaBannerText,
				applicationCategories: 'none_of_these',
				typeOfPlanningApplication: 'full-appeal',
				errors: {},
				errorSummary: [{ text: error.toString(), href: '#' }]
			});
		});
	});
});
