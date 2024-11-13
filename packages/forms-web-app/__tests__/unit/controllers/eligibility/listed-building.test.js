const appeal = require('@pins/business-rules/test/data/householder-appeal');
const {
	getServiceNotAvailableForListedBuildings,
	getListedBuilding,
	postListedBuilding
} = require('../../../../src/controllers/eligibility/listed-building');
const { createOrUpdateAppeal } = require('../../../../src/lib/appeals-api-wrapper');
const { VIEW } = require('../../../../src/lib/views');
const { mockReq, mockRes } = require('../../mocks');
const config = require('../../../../src/config');

jest.mock('../../../../src/lib/appeals-api-wrapper');

describe('controllers/eligibility/listed-building', () => {
	let req;
	let res;

	beforeEach(() => {
		req = {
			...mockReq(appeal),
			log: {
				error: jest.fn()
			}
		};
		res = mockRes();

		jest.resetAllMocks();
	});

	describe('getServiceNotAvailableForListedBuildings', () => {
		it('calls the correct template', () => {
			getServiceNotAvailableForListedBuildings(req, res);

			expect(res.render).toHaveBeenCalledWith(VIEW.ELIGIBILITY.LISTED_OUT, {
				bannerHtmlOverride: config.betaBannerText
			});
		});
	});

	describe('getListedBuilding', () => {
		it('calls the correct template', () => {
			getListedBuilding(req, res);

			expect(res.render).toHaveBeenCalledWith(VIEW.ELIGIBILITY.LISTED_BUILDING, {
				bannerHtmlOverride: config.betaBannerText,
				appeal: req.session.appeal
			});
		});
	});

	describe('postListedBuilding', () => {
		it('should re-render the template with errors if there is any validation error', async () => {
			const mockRequest = {
				...req,
				body: {
					'is-your-appeal-about-a-listed-building': 'bad value',
					errors: { a: 'b' },
					errorSummary: [{ text: 'There were errors here', href: '#' }]
				}
			};
			await postListedBuilding(mockRequest, res);

			expect(createOrUpdateAppeal).not.toHaveBeenCalled();

			expect(res.redirect).not.toHaveBeenCalled();
			expect(res.render).toHaveBeenCalledWith(VIEW.ELIGIBILITY.LISTED_BUILDING, {
				bannerHtmlOverride: config.betaBannerText,
				appeal: {
					...req.session.appeal,
					eligibility: {
						...req.session.appeal.eligibility,
						isListedBuilding: null
					}
				},
				errorSummary: [{ text: 'There were errors here', href: '#' }],
				errors: { a: 'b' }
			});
		});

		it('should re-render the template with errors if there is any api call error', async () => {
			const mockRequest = {
				...req,
				body: {}
			};

			const error = new Error('Cheers');
			createOrUpdateAppeal.mockImplementation(() => Promise.reject(error));

			await postListedBuilding(mockRequest, res);

			expect(res.redirect).not.toHaveBeenCalled();

			expect(res.render).toHaveBeenCalledWith(VIEW.ELIGIBILITY.LISTED_BUILDING, {
				bannerHtmlOverride: config.betaBannerText,
				appeal: req.session.appeal,
				errors: {},
				errorSummary: [{ text: error.toString(), href: '#' }]
			});
		});

		it('should redirect to `/before-you-start/use-existing-service-listed-building` if `is-your-appeal-about-a-listed-building` is `yes`', async () => {
			const mockRequest = {
				...req,
				body: {
					'is-your-appeal-about-a-listed-building': 'yes'
				}
			};
			await postListedBuilding(mockRequest, res);

			expect(createOrUpdateAppeal).toHaveBeenCalledWith({
				...appeal,
				eligibility: {
					...appeal.eligibility,
					isListedBuilding: true
				}
			});

			expect(res.redirect).toHaveBeenCalledWith(
				`/${VIEW.BEFORE_YOU_START.USE_EXISTING_SERVICE_LISTED_BUILDING}`
			);
		});

		it('should redirect to `/eligibility/costs` if `is-your-appeal-about-a-listed-building` is `no`', async () => {
			const mockRequest = {
				...req,
				body: {
					'is-your-appeal-about-a-listed-building': 'no'
				}
			};
			await postListedBuilding(mockRequest, res);

			expect(createOrUpdateAppeal).toHaveBeenCalledWith({
				...appeal,
				eligibility: {
					...appeal.eligibility,
					isListedBuilding: false
				}
			});

			expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.ELIGIBILITY.COSTS}`);
		});
	});
});
