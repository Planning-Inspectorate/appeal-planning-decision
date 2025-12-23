const {
	getApplicationFailedLookup,
	postApplicationFailedLookup
} = require('./application-not-found');
const {
	VIEW: {
		BEFORE_YOU_START: { APPLICATION_LOOKUP_FAILED }
	}
} = require('../../lib/views');

/**
 * @param {object} [appeal]
 * @returns {{ session: { appeal: object }, body: object }}
 */
const mockReq = (appeal = {}) => ({ session: { appeal }, body: {} });
/**
 * @returns {{ render: jest.Mock, redirect: jest.Mock }}
 */
const mockRes = () => {
	const res = {};
	res.render = jest.fn();
	res.redirect = jest.fn();
	return res;
};

describe('controllers/before-you-start/application-not-found', () => {
	/** @type {{ session: { appeal: object }, body: object }} */
	let req;
	/** @type {{ render: jest.Mock, redirect: jest.Mock }} */
	let res;
	const confirmInputName = 'confirm-application-number';
	const typeOfApplicationPage = '/before-you-start/type-of-planning-application';

	beforeEach(() => {
		req = mockReq({ planningApplicationNumber: '12345' });
		res = mockRes();
		if (jest.clearAllMocks) jest.clearAllMocks();
	});

	afterEach(() => {
		if (jest.resetAllMocks) jest.resetAllMocks();
	});

	describe('getApplicationFailedLookup', () => {
		it('renders the view with planningApplicationNumber', async () => {
			await getApplicationFailedLookup(req, res);
			expect(res.render).toHaveBeenCalledWith(APPLICATION_LOOKUP_FAILED, {
				planningApplicationNumber: '12345'
			});
		});
	});

	describe('postApplicationFailedLookup', () => {
		it('re-renders with errors if confirm input has errors', async () => {
			req.body = {
				errors: { [confirmInputName]: { msg: 'Required' } },
				errorSummary: [{ text: 'Required', href: `#${confirmInputName}` }],
				[confirmInputName]: 'no'
			};
			await postApplicationFailedLookup(req, res);
			expect(res.render).toHaveBeenCalledWith(APPLICATION_LOOKUP_FAILED, {
				confirmApplicationNumber: 'no',
				planningApplicationNumber: '12345',
				errors: { [confirmInputName]: { msg: 'Required' } },
				errorSummary: [{ text: 'Required', href: `#${confirmInputName}` }]
			});
		});

		it('redirects to typeOfApplicationPage if confirmApplicationNumber is yes', async () => {
			req.body = { [confirmInputName]: 'yes' };
			await postApplicationFailedLookup(req, res);
			expect(res.redirect).toHaveBeenCalledWith(typeOfApplicationPage);
		});

		it('redirects to application-number if confirmApplicationNumber is not yes', async () => {
			req.body = { [confirmInputName]: 'no' };
			await postApplicationFailedLookup(req, res);
			expect(res.redirect).toHaveBeenCalledWith(`/before-you-start/application-number`);
		});
	});
});
