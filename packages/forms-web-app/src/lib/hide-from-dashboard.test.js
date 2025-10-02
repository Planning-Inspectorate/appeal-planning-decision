jest.mock('./appeals-api-wrapper');
const { createOrUpdateAppeal } = require('./appeals-api-wrapper');
const { hideFromDashboard } = require('./hide-from-dashboard');

describe('hideFromDashboard', () => {
	it('sets hideFromDashboard to true and updates session appeal', async () => {
		const appeal = { id: 1 };
		const req = {
			session: {}
		};

		await hideFromDashboard(req, appeal);

		expect(appeal.hideFromDashboard).toBe(true);
		expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);
	});

	it('does not reset hideFromDashboard', async () => {
		const appeal = { id: 1, hideFromDashboard: true };
		const req = {
			session: {}
		};

		await hideFromDashboard(req, appeal);

		expect(appeal.hideFromDashboard).toBe(true);
		expect(createOrUpdateAppeal).not.toHaveBeenCalled();
	});
});
