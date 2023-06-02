const { mockReq, mockRes } = require('../mocks');
const checkFinalCommentDeadline = require('../../../src/middleware/final-comment/check-final-comment-deadline');
const { utils } = require('@pins/common');
const config = require('../../../src/config');

const {
	VIEW: {
		FINAL_COMMENT: { APPEAL_CLOSED_FOR_COMMENT }
	}
} = require('../../../src/lib/views');

jest.mock('../../../src/lib/logger', () => ({
	info: jest.fn()
}));

describe('middleware/final-comment/check-final-comment-deadline', () => {
	let req;
	let res;
	let next;

	beforeEach(() => {
		// mockReq by default sets an appeal field and places appeal object in session
		// so pass null and clear req.session to use for final comments
		res = mockRes();
		next = jest.fn();
		jest.resetAllMocks();
		jest.useFakeTimers('modern');
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	it('should render error page when final comment is not found in session', () => {
		req = {
			...mockReq(null),
			session: {}
		};

		checkFinalCommentDeadline(req, res);

		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.render).toHaveBeenCalledWith('error/not-found');
	});

	it('should render error page when final comment secureCodeEnteredCorrectly is not true', () => {
		const possibleSecureCodes = [false, 'true', 1, '', undefined, null];

		possibleSecureCodes.forEach((secureCodeEnteredCorrectly) => {
			const req = {
				...mockReq(null),
				session: {
					finalComment: {
						finalCommentExpiryDate: '2023-06-01T23:59:59.999Z',
						lpaCode: 'abc',
						secureCodeEnteredCorrectly
					}
				}
			};

			jest.setSystemTime(new Date('2023-06-01T12:00:00.000Z'));

			checkFinalCommentDeadline(req, res, jest.fn());

			expect(res.status).toHaveBeenCalledWith(404);
			expect(res.render).toHaveBeenCalledWith('error/not-found');
		});
	});

	it('should call the next middleware when within the deadline date', () => {
		req = {
			...mockReq(null),
			session: {
				finalComment: {
					finalCommentExpiryDate: '2023-06-01T23:59:59.999Z',
					lpaCode: 'abc',
					secureCodeEnteredCorrectly: true
				}
			}
		};

		jest.setSystemTime(new Date('2023-06-01T12:00:00.000Z'));

		checkFinalCommentDeadline(req, res, next);

		expect(res.redirect).not.toHaveBeenCalled();
		expect(next).toHaveBeenCalled();
	});

	it('should allow past middleware check when testing override is enabled and override within debug date', () => {
		req = {
			...mockReq(null),
			session: {
				finalComment: {
					finalCommentExpiryDate: '2023-05-31T23:59:59.999Z',
					lpaCode: utils.testLPACode,
					secureCodeEnteredCorrectly: true
				},
				finalCommentOverrideExpiryDate: '2023-06-02T23:59:59.999Z'
			}
		};
		config.server.allowTestingOverrides = true;

		jest.setSystemTime(new Date('2023-06-01T00:00:00.000Z'));

		checkFinalCommentDeadline(req, res, next);

		expect(res.redirect).not.toHaveBeenCalled();
		expect(next).toHaveBeenCalled();
	});

	it('should redirect to APPEAL_CLOSED_FOR_COMMENT if override is set but override not within debug date', () => {
		req = {
			...mockReq(null),
			session: {
				finalComment: {
					finalCommentExpiryDate: '2023-05-31T23:59:59.999Z',
					lpaCode: utils.testLPACode,
					secureCodeEnteredCorrectly: true
				},
				finalCommentOverrideExpiryDate: '2023-05-02T23:59:59.999Z'
			}
		};
		config.server.allowTestingOverrides = true;

		jest.setSystemTime(new Date('2023-06-01T00:00:00.000Z'));

		checkFinalCommentDeadline(req, res, next);

		expect(res.redirect).toHaveBeenCalledWith('/' + APPEAL_CLOSED_FOR_COMMENT);
	});

	it('should redirect to APPEAL_CLOSED_FOR_COMMENT if override is set but and not in test', () => {
		req = {
			...mockReq(null),
			session: {
				finalComment: {
					finalCommentExpiryDate: '2023-05-31T23:59:59.999Z',
					lpaCode: utils.testLPACode,
					secureCodeEnteredCorrectly: true
				},
				finalCommentOverrideExpiryDate: '2023-06-02T23:59:59.999Z'
			}
		};
		config.server.allowTestingOverrides = false;

		jest.setSystemTime(new Date('2023-06-01T00:00:00.000Z'));

		checkFinalCommentDeadline(req, res, next);

		expect(res.redirect).toHaveBeenCalledWith('/' + APPEAL_CLOSED_FOR_COMMENT);
	});
});
