const appeal = require('@pins/business-rules/test/data/full-appeal');
const {
	getAppealSiteAddress,
	postAppealSiteAddress
} = require('../../../../../src/controllers/full-appeal/submit-appeal/appeal-site-address');
const { mockReq, mockRes } = require('../../../mocks');
const { createOrUpdateAppeal } = require('../../../../../src/lib/appeals-api-wrapper');
const logger = require('../../../../../src/lib/logger');

const {
	VIEW: {
		FULL_APPEAL: { APPEAL_SITE_ADDRESS: currentPage, OWN_ALL_THE_LAND }
	}
} = require('../../../../../src/lib/full-appeal/views');

jest.mock('../../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../../src/services/task.service');
jest.mock('../../../../../src/lib/logger');

const sectionName = 'appealSiteSection';
const taskName = 'siteAddress';

describe('controllers/full-appeal/submit-appeal/appeal-site-address', () => {
	let req;
	let res;

	beforeEach(() => {
		req = mockReq(appeal);
		res = mockRes();

		jest.resetAllMocks();
	});

	describe('getAppealSiteAddress', () => {
		it('should call the correct template', () => {
			getAppealSiteAddress(req, res);

			expect(res.render).toHaveBeenCalledWith(currentPage, {
				appeal: req.session.appeal
			});
		});
	});

	describe('postAppealSiteAddress', () => {
		it('should re-render the template with errors if submission validation fails', async () => {
			const mockRequest = {
				...req,
				body: {
					errors: { a: 'b' },
					errorSummary: [{ text: 'There were errors here', href: '#' }]
				}
			};
			await postAppealSiteAddress(mockRequest, res);

			expect(res.redirect).not.toHaveBeenCalled();
			expect(res.render).toHaveBeenCalledWith(currentPage, {
				appeal: {
					...req.session.appeal,
					[sectionName]: {
						...req.session.appeal[sectionName],
						[taskName]: {
							addressLine1: undefined,
							addressLine2: undefined,
							county: undefined,
							postcode: undefined,
							town: undefined
						}
					}
				},
				errorSummary: [{ text: 'There were errors here', href: '#' }],
				errors: { a: 'b' }
			});
		});

		it('should log an error if the api call fails, and remain on the same page', async () => {
			const error = new Error('API is down');
			createOrUpdateAppeal.mockImplementation(() => Promise.reject(error));
			const mockRequest = {
				...req,
				body: {}
			};
			await postAppealSiteAddress(mockRequest, res);

			expect(logger.error).toHaveBeenCalledWith(error);

			expect(res.redirect).not.toHaveBeenCalled();

			expect(res.render).toHaveBeenCalledWith(currentPage, {
				appeal: req.session.appeal,
				errors: {},
				errorSummary: [{ text: error.toString(), href: '#' }]
			});
		});

		it('should redirect to `/full-appeal/submit-appeal/own-all-the-land` if valid', async () => {
			const fakeLine1 = '1 Taylor Road';
			const fakeLine2 = 'Clifton';
			const fakeTownCity = 'Bristol';
			const fakeCounty = 'South Glos';
			const fakePostcode = 'BS8 1TG';
			const fakeTaskStatus = 'COMPLETED';

			const mockRequest = {
				...req,
				body: {
					'site-address-line-one': fakeLine1,
					'site-address-line-two': fakeLine2,
					'site-town-city': fakeTownCity,
					'site-county': fakeCounty,
					'site-postcode': fakePostcode
				}
			};
			await postAppealSiteAddress(mockRequest, res);

			expect(createOrUpdateAppeal).toHaveBeenCalledWith({
				...appeal,
				[sectionName]: {
					...appeal[sectionName],
					[taskName]: {
						addressLine1: fakeLine1,
						addressLine2: fakeLine2,
						county: fakeCounty,
						postcode: fakePostcode,
						town: fakeTownCity
					}
				},
				sectionStates: {
					...appeal.sectionStates,
					[sectionName]: {
						...appeal.sectionStates[sectionName],
						[taskName]: fakeTaskStatus
					}
				}
			});

			expect(res.redirect).toHaveBeenCalledWith(`/${OWN_ALL_THE_LAND}`);
		});
	});
});
