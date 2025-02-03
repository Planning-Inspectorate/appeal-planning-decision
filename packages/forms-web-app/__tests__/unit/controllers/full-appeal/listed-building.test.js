const appeal = require('@pins/business-rules/test/data/householder-appeal');
const fullAppeal = require('@pins/business-rules/test/data/full-appeal');
const {
	getListedBuilding,
	postListedBuilding
} = require('../../../../src/controllers/full-appeal/listed-building');
const { createOrUpdateAppeal } = require('../../../../src/lib/appeals-api-wrapper');
const logger = require('../../../../src/lib/logger');
const {
	VIEW: {
		BEFORE_YOU_START: { LISTED_BUILDING }
	}
} = require('../../../../src/lib/views');

const { mockReq, mockRes } = require('../../mocks');
const config = require('../../../../src/config');
const { isLpaInFeatureFlag } = require('#lib/is-lpa-in-feature-flag');

jest.mock('../../../../src/lib/is-lpa-in-feature-flag');
jest.mock('../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../src/lib/logger');

describe('controllers/full-appeal/listed-building', () => {
	let req;
	let res;

	beforeEach(() => {
		req = mockReq(appeal);
		res = mockRes();

		jest.resetAllMocks();
	});

	describe('getListedBuilding', () => {
		it('should call the correct template on getListedBuilding', async () => {
			await getListedBuilding(req, res);

			expect(res.render).toHaveBeenCalledWith(LISTED_BUILDING, {
				bannerHtmlOverride: config.betaBannerText,
				isListedBuilding: appeal.eligibility.isListedBuilding
			});
		});

		it('should call the correct template on getListedBuilding - if full appeal v1', async () => {
			req = mockReq(fullAppeal);
			req.session.appeal.eligibility.isListedBuilding = null;

			await getListedBuilding(req, res);

			expect(res.render).toHaveBeenCalledWith(LISTED_BUILDING, {
				bannerHtmlOverride: config.betaBannerText,
				isListedBuilding: false
			});
		});

		it('should call the correct template on getListedBuilding - if full appeal v2', async () => {
			isLpaInFeatureFlag.mockReturnValueOnce(true);
			req = mockReq(fullAppeal);
			req.session.appeal.eligibility.isListedBuilding = true;
			await getListedBuilding(req, res);

			expect(res.render).toHaveBeenCalledWith(LISTED_BUILDING, {
				bannerHtmlOverride: config.betaBannerText,
				isListedBuilding: true
			});
		});
	});

	describe('postListedBuilding', () => {
		it(`should redirect to the use-existing-service-listed-building page if 'yes' is selected`, async () => {
			const mockRequest = {
				...req,
				body: { 'listed-building': 'yes' }
			};

			await postListedBuilding(mockRequest, res);

			expect(appeal.eligibility.isListedBuilding).toEqual(true);
			expect(createOrUpdateAppeal).toHaveBeenCalledWith({ ...appeal });

			expect(res.redirect).toHaveBeenCalledWith(
				'/before-you-start/use-existing-service-listed-building'
			);
		});

		it(`should redirect to the granted-or-refused-householder page if HAS and 'no' is selected`, async () => {
			const mockRequest = {
				...req,
				body: { 'listed-building': 'no' }
			};

			await postListedBuilding(mockRequest, res);

			expect(appeal.eligibility.isListedBuilding).toEqual(false);
			expect(createOrUpdateAppeal).toHaveBeenCalledWith({
				...appeal
			});

			expect(res.redirect).toHaveBeenCalledWith('/before-you-start/granted-or-refused-householder');
		});

		it(`should redirect to the granted-or-refused page if S78 and 'no' is selected`, async () => {
			req = mockReq(fullAppeal);
			const mockRequest = {
				...req,
				body: { 'listed-building': 'no' }
			};

			await postListedBuilding(mockRequest, res);

			expect(appeal.eligibility.isListedBuilding).toEqual(false);
			expect(createOrUpdateAppeal).toHaveBeenCalledWith({
				...fullAppeal
			});

			expect(res.redirect).toHaveBeenCalledWith('/before-you-start/granted-or-refused');
		});

		it('should re-render the template with errors if there is any validation error', async () => {
			const mockRequest = {
				...req,
				body: {
					errors: {
						'listed-building': {
							msg: 'Select yes if your appeal is about a listed building'
						}
					}
				}
			};

			await postListedBuilding(mockRequest, res);

			expect(createOrUpdateAppeal).not.toHaveBeenCalled();

			expect(res.render).toHaveBeenCalledWith(LISTED_BUILDING, {
				bannerHtmlOverride: config.betaBannerText,
				isListedBuilding: null,
				errors: {
					'listed-building': {
						msg: 'Select yes if your appeal is about a listed building'
					}
				},
				errorSummary: []
			});
		});

		it('should re-render the template with errors if there is any api call error', async () => {
			const error = new Error('API is down');

			const mockRequest = {
				...req,
				body: { 'listed-building': 'outline-planning' }
			};

			createOrUpdateAppeal.mockImplementation(() => Promise.reject(error));

			await postListedBuilding(mockRequest, res);

			expect(res.redirect).not.toHaveBeenCalled();
			expect(logger.error).toHaveBeenCalledWith(error);

			expect(res.render).toHaveBeenCalledWith(LISTED_BUILDING, {
				bannerHtmlOverride: config.betaBannerText,
				isListedBuilding: appeal.eligibility.isListedBuilding,
				errors: {},
				errorSummary: [{ text: error.toString(), href: '#' }]
			});
		});
	});
});
