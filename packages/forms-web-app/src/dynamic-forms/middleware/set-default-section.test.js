const setDefaultSection = require('./set-default-section');

jest.mock('../../config', () => ({
	dynamicForms: {
		DEFAULT_SECTION: 'test-section'
	}
}));

describe('setDefaultSection middleware', () => {
	let req, res, next;

	beforeEach(() => {
		req = { params: {} };
		res = {};
		next = jest.fn();
	});

	it('should set req.params.section to DEFAULT_SECTION if not present', () => {
		setDefaultSection()(req, res, next);
		expect(req.params.section).toBe('test-section');
		expect(next).toHaveBeenCalled();
	});

	it('should not overwrite req.params.section if already present', () => {
		req.params.section = 'existing-section';
		setDefaultSection()(req, res, next);
		expect(req.params.section).toBe('existing-section');
		expect(next).toHaveBeenCalled();
	});
});
