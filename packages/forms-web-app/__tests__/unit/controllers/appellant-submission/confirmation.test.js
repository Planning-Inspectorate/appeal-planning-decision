const {
	getConfirmation
} = require('../../../../src/controllers/appellant-submission/confirmation');
const { mockReq, mockRes } = require('../../mocks');
const {
	VIEW: {
		APPELLANT_SUBMISSION: { CONFIRMATION }
	}
} = require('../../../../src/lib/views');
describe('controllers/appellant-submission/confirmation', () => {
	let req;
	let res;

	beforeEach(() => {
		req = mockReq();
		res = mockRes();
	});

	describe('getConfirmation', () => {
		let appealId;
		let appellantEmail;

		beforeEach(() => {
			appealId = 'some-fake-id';
			appellantEmail = 'hello@example.com';

			req = {
				...req,
				session: {
					...req.session,
					appeal: {
						id: appealId,
						'appellant-email': appellantEmail
					}
				}
			};
		});

		it('should ensure req.session.appeal is reset', () => {
			expect(req.session.appeal).not.toBeNull();

			getConfirmation(req, res);

			expect(req.session.appeal).toBeNull();
		});

		it('should call the correct template', () => {
			getConfirmation(req, res);

			expect(res.render).toHaveBeenCalledWith(CONFIRMATION, {
				appellantEmail,
				appealId
			});
		});
	});
});
