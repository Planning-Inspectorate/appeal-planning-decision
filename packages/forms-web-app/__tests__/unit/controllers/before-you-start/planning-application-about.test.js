const mockAppeal = {
	id: 'appeal-id',
	eligibility: {
		planningApplicationAbout: ['optionA']
	}
};

const appAboutOptions = {
	OPTION_A: 'optionA',
	OPTION_B: 'optionB',
	NON_OF_THESE: 'noneOfThese'
};

const APPEAL_ID = {
	PLANNING_SECTION_78: 'section78'
};

jest.mock('../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../src/lib/logger');
jest.mock('@pins/business-rules', () => ({
	constants: {
		APPEAL_ID: {
			PLANNING_SECTION_78: 'section78'
		},
		APPLICATION_ABOUT: {
			OPTION_A: 'optionA',
			OPTION_B: 'optionB',
			NON_OF_THESE: 'noneOfThese'
		},
		APPLICATION_ABOUT_LABELS: {
			optionA: 'Option A',
			optionB: 'Option B',
			noneOfThese: 'None of these'
		}
	}
}));

const { createOrUpdateAppeal } = require('../../../../src/lib/appeals-api-wrapper');
const logger = require('../../../../src/lib/logger');

const {
	getApplicationAbout,
	postApplicationAbout
} = require('../../../../src/controllers/before-you-start/planning-application-about');

describe('Planning Application About Controller', () => {
	describe('getApplicationAbout', () => {
		it('renders the view with current planningApplicationAbout', () => {
			const req = { session: { appeal: mockAppeal } };
			const res = { render: jest.fn() };
			getApplicationAbout(req, res);
			expect(res.render).toHaveBeenCalledWith(
				expect.any(String),
				expect.objectContaining({
					appeal: mockAppeal,
					planningApplicationAbout: ['optionA']
				})
			);
		});

		it('renders the view with empty array if planningApplicationAbout is missing', () => {
			const req = { session: { appeal: { eligibility: {} } } };
			const res = { render: jest.fn() };
			getApplicationAbout(req, res);
			expect(res.render).toHaveBeenCalledWith(
				expect.any(String),
				expect.objectContaining({
					planningApplicationAbout: []
				})
			);
		});
	});

	describe('postApplicationAbout', () => {
		let req, res;

		beforeEach(() => {
			req = {
				body: {},
				session: { appeal: { ...mockAppeal, eligibility: {} } }
			};
			res = {
				render: jest.fn(),
				redirect: jest.fn()
			};
			createOrUpdateAppeal.mockReset();
			logger.error.mockReset();
		});

		it('renders with errors if errors are present in body', async () => {
			req.body = {
				errors: { planningApplicationAbout: { msg: 'Error' } },
				errorSummary: [{ text: 'Error', href: '#planningApplicationAbout' }],
				planningApplicationAbout: 'optionA'
			};
			await postApplicationAbout(req, res);
			expect(res.render).toHaveBeenCalledWith(
				expect.any(String),
				expect.objectContaining({
					errors: req.body.errors,
					errorSummary: req.body.errorSummary,
					focusErrorSummary: true
				})
			);
			expect(createOrUpdateAppeal).not.toHaveBeenCalled();
		});

		it('updates appeal and redirects if valid and not CAS planning', async () => {
			req.body = { planningApplicationAbout: 'optionA' };
			createOrUpdateAppeal.mockResolvedValue({
				id: 'appeal-id',
				eligibility: {
					planningApplicationAbout: ['optionA']
				},
				appealType: APPEAL_ID.PLANNING_SECTION_78
			});
			await postApplicationAbout(req, res);
			expect(createOrUpdateAppeal).toHaveBeenCalledWith(
				expect.objectContaining({
					eligibility: expect.objectContaining({
						planningApplicationAbout: ['optionA']
					}),
					appealType: APPEAL_ID.PLANNING_SECTION_78
				})
			);
			expect(res.redirect).toHaveBeenCalledWith('/before-you-start/granted-or-refused');
		});

		it('updates appeal and does not set appealType if CAS planning', async () => {
			req.body = { planningApplicationAbout: appAboutOptions.NON_OF_THESE };
			createOrUpdateAppeal.mockResolvedValue({
				id: 'appeal-id',
				eligibility: { planningApplicationAbout: [appAboutOptions.NON_OF_THESE] }
			});
			await postApplicationAbout(req, res);
			expect(createOrUpdateAppeal).toHaveBeenCalledWith(
				expect.objectContaining({
					eligibility: expect.objectContaining({
						planningApplicationAbout: [appAboutOptions.NON_OF_THESE]
					})
				})
			);
			expect(res.redirect).toHaveBeenCalledWith('/before-you-start/granted-or-refused');
		});

		it('handles array input for planningApplicationAbout', async () => {
			req.body = { planningApplicationAbout: ['optionA', 'optionB'] };
			createOrUpdateAppeal.mockResolvedValue({
				id: 'appeal-id',
				eligibility: {
					planningApplicationAbout: ['optionA', 'optionB']
				},
				appealType: APPEAL_ID.PLANNING_SECTION_78
			});
			await postApplicationAbout(req, res);
			expect(createOrUpdateAppeal).toHaveBeenCalledWith(
				expect.objectContaining({
					eligibility: expect.objectContaining({
						planningApplicationAbout: ['optionA', 'optionB']
					}),
					appealType: APPEAL_ID.PLANNING_SECTION_78
				})
			);
			expect(res.redirect).toHaveBeenCalledWith('/before-you-start/granted-or-refused');
		});

		it('renders error if createOrUpdateAppeal throws', async () => {
			req.body = { planningApplicationAbout: 'optionA' };
			const error = new Error('DB error');
			createOrUpdateAppeal.mockRejectedValue(error);
			await postApplicationAbout(req, res);
			expect(logger.error).toHaveBeenCalledWith(error);
			expect(res.render).toHaveBeenCalledWith(
				expect.any(String),
				expect.objectContaining({
					errorSummary: [{ text: 'Unable to save answers', href: '#' }]
				})
			);
			expect(res.redirect).not.toHaveBeenCalled();
		});
	});
});
