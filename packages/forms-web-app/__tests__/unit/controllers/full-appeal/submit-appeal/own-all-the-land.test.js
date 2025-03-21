const appeal = require('@pins/business-rules/test/data/full-appeal');
const v8 = require('v8');
const {
	getOwnAllTheLand,
	postOwnAllTheLand
} = require('../../../../../src/controllers/full-appeal/submit-appeal/own-all-the-land');
const { createOrUpdateAppeal } = require('../../../../../src/lib/appeals-api-wrapper');
const { mockReq, mockRes } = require('../../../mocks');
const {
	VIEW: {
		FULL_APPEAL: { AGRICULTURAL_HOLDING, OWN_ALL_THE_LAND, OWN_SOME_OF_THE_LAND }
	}
} = require('../../../../../src/lib/views');

jest.mock('../../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../../src/services/task.service');

describe('controllers/full-appeal/submit-appeal/own-all-the-land', () => {
	let req;
	let res;

	const sectionName = 'appealSiteSection';
	const taskName = 'siteOwnership';
	const errors = { 'own-all-the-land': 'Select an option' };
	const errorSummary = [{ text: 'There was an error', href: '#' }];
	appeal.sectionStates.appealSiteSection.ownsAllTheLand = 'COMPLETED';

	beforeEach(() => {
		req = v8.deserialize(
			v8.serialize({
				...mockReq(appeal),
				body: {}
			})
		);
		res = mockRes();

		jest.resetAllMocks();
	});

	describe('getOwnAllTheLand', () => {
		it('should call the correct template', () => {
			getOwnAllTheLand(req, res);

			expect(res.render).toHaveBeenCalledTimes(1);
			expect(res.render).toHaveBeenCalledWith(OWN_ALL_THE_LAND, {
				ownsAllTheLand: true
			});
		});
	});

	describe('postOwnAllTheLand', () => {
		it('should re-render the template with errors if submission validation fails', async () => {
			req = {
				...req,
				body: {
					'own-all-the-land': undefined,
					errors,
					errorSummary
				}
			};

			await postOwnAllTheLand(req, res);

			expect(res.redirect).not.toHaveBeenCalled();
			expect(res.render).toHaveBeenCalledTimes(1);
			expect(res.render).toHaveBeenCalledWith(OWN_ALL_THE_LAND, {
				errors,
				errorSummary
			});
		});

		it('should re-render the template with errors if an error is thrown', async () => {
			const error = new Error('Internal Server Error');

			createOrUpdateAppeal.mockImplementation(() => {
				throw error;
			});

			await postOwnAllTheLand(req, res);

			expect(res.redirect).not.toHaveBeenCalled();
			expect(res.render).toHaveBeenCalledTimes(1);
			expect(res.render).toHaveBeenCalledWith(OWN_ALL_THE_LAND, {
				ownsAllTheLand: false,
				errors: {},
				errorSummary: [{ text: error.toString(), href: '#' }]
			});
		});

		it('should redirect to the correct page if `yes` has been selected', async () => {
			const submittedAppeal = {
				...appeal,
				state: 'SUBMITTED',
				appealSiteSection: {
					...appeal.appealSiteSection,
					siteOwnership: {
						ownsAllTheLand: true,
						ownsSomeOfTheLand: null,
						knowsTheOwners: null,
						hasIdentifiedTheOwners: null,
						tellingTheLandowners: null,
						advertisingYourAppeal: null
					}
				}
			};

			createOrUpdateAppeal.mockReturnValue(submittedAppeal);

			req = {
				...req,
				body: {
					'own-all-the-land': 'yes'
				}
			};

			await postOwnAllTheLand(req, res);
			expect(createOrUpdateAppeal).toHaveBeenCalledWith(req.session.appeal);
			expect(res.redirect).toHaveBeenCalledWith(`/${AGRICULTURAL_HOLDING}`);
			expect(req.session.appeal).toEqual(submittedAppeal);
		});

		it('should redirect to the correct page if `no` has been selected', async () => {
			const submittedAppeal = {
				...appeal,
				state: 'SUBMITTED'
			};
			submittedAppeal[sectionName][taskName].ownsAllTheLand = false;

			createOrUpdateAppeal.mockReturnValue(submittedAppeal);

			req = {
				...req,
				body: {
					'own-all-the-land': 'no'
				}
			};

			await postOwnAllTheLand(req, res);

			expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);
			expect(res.redirect).toHaveBeenCalledWith(`/${OWN_SOME_OF_THE_LAND}`);
			expect(req.session.appeal).toEqual(submittedAppeal);
		});
	});
});
