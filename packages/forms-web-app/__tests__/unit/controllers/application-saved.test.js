const { getApplicationSaved } = require('../../../src/controllers/application-saved');

const { VIEW } = require('../../../src/lib/views');
const { mockReq, mockRes } = require('../mocks');

describe('controllers/application-saved', () => {
	let req = mockReq();
	let res = mockRes();
	it('getApplicationSaved method calls the correct template', async () => {
		req = {
			session: {
				appeal: {
					planningApplicationNumber: '123456',
					eligibility: { applicationDecision: 'refused' },
					decisionDate: '2022-02-20T00:00:00.000Z'
				}
			}
		};
		await getApplicationSaved(req, res);

		expect(res.render).toBeCalledWith(VIEW.APPLICATION_SAVED, {
			applicationNumber: '123456',
			deadline: { date: 14, day: 'Saturday', month: 'May', year: 2022 }
		});
	});
});
