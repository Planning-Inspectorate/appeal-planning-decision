const { get, post } = require('../../../../src/controllers/appeal/new-saved-appeal');

const { VIEW } = require('../../../../src/lib/views');
const { mockReq, mockRes } = require('../../mocks');

jest.mock('../../../../src/lib/appeals-api-wrapper');

describe('controllers/appeal/new-or-saved-appeal', () => {
	let req;
	let res;
	beforeEach(() => {
		req = mockReq();
		res = mockRes();
		req.session = { newOrSavedAppeal: 'save-new' };
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('Test get method calls the correct template', async () => {
		await get(req, res);

		expect(res.render).toHaveBeenCalledWith(VIEW.APPEAL.NEW_OR_SAVED_APPEAL, {
			newOrSavedAppeal: 'save-new'
		});
	});

	it('Test post method stays on the same page if errors are present', async () => {
		req.body = {
			errors: { fieldName: 'an error occured' },
			errorSummary: ['an error occured'],
			'new-or-saved-appeal': 'save-new'
		};
		await post(req, res);

		expect(res.render).toHaveBeenCalledWith(VIEW.APPEAL.NEW_OR_SAVED_APPEAL, {
			errors: { fieldName: 'an error occured' },
			errorSummary: ['an error occured'],
			newOrSavedAppeal: 'save-new'
		});
	});

	it('Test post method sets session with data entered', async () => {
		req.body = {
			'new-or-saved-appeal': 'save-new'
		};
		await post(req, res);

		expect(req.session).toEqual({ newOrSavedAppeal: 'save-new' });
	});

	it('Test post method redirects to correct page when user chose to start a new appeal', async () => {
		req.body = {
			'new-or-saved-appeal': 'save-new'
		};
		await post(req, res);

		expect(res.redirect).toHaveBeenCalledWith('/before-you-start');
	});

	it('Test post method redirects to correct page when user chose to return to an existing appeal', async () => {
		req.body = {
			'new-or-saved-appeal': 'return'
		};
		await post(req, res);

		expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.APPEAL.EMAIL_ADDRESS}`);
	});
});
