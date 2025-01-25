const checkNotSubmitted = require('./check-not-submitted');
const {
	VIEW: { SELECTED_APPEAL, LPA_DASHBOARD, RULE_6 }
} = require('../../lib/views');
const testUrl = '/test';

describe('dynamic-forms/middleware/check-not-submitted', () => {
	let mockReq;

	beforeEach(() => {
		mockReq = (userType = null) => ({
			cookies: {},
			log: {},
			params: {},
			session: {
				user: userType,
				navigationHistory: ['previous-page']
			}
		});
	});

	[
		{
			description: 'should do nothing if submitted is undefined',
			given: () => {
				return {
					req: mockReq(),
					res: {}
				};
			},
			expected: (req, res, next) => {
				expect(next).toHaveBeenCalled();
			}
		},
		{
			description: 'should do nothing if submitted is false',
			given: () => {
				return {
					req: mockReq(),
					res: {
						locals: {
							journeyResponse: {
								answers: { submitted: false }
							}
						}
					}
				};
			},
			expected: (req, res, next) => {
				expect(next).toHaveBeenCalled();
			}
		},
		{
			description: 'should do nothing if submitted is no',
			given: () => {
				return {
					req: mockReq(),
					res: {
						locals: {
							journeyResponse: {
								answers: {
									submitted: 'no'
								}
							}
						}
					}
				};
			},
			expected: (req, res, next) => {
				expect(next).toHaveBeenCalled();
			}
		},
		{
			description: 'should redirect if submitted is true',
			given: () => {
				return {
					req: mockReq(),
					res: {
						locals: {
							journeyResponse: {
								answers: {
									submitted: true
								}
							}
						},
						redirect: jest.fn()
					}
				};
			},
			expected: (req, res) => {
				expect(res.redirect).toHaveBeenCalled();
			}
		},
		{
			description: 'should redirect if submitted is yes',
			given: () => {
				return {
					req: mockReq(),
					res: {
						locals: {
							journeyResponse: {
								answers: {
									submitted: 'yes'
								}
							}
						},
						redirect: jest.fn()
					}
				};
			},
			expected: (req, res) => {
				expect(res.redirect).toHaveBeenCalled();
			}
		}
	].forEach(({ description, given, expected }) => {
		it(description, () => {
			const next = jest.fn();
			const req = given().req;
			const res = given().res;

			checkNotSubmitted(testUrl)(req, res, next);

			expected(req, res, next);
		});
	});
	it('should redirect to LPA dashboard if submitted is yes and user is LPA', () => {
		const next = jest.fn();
		const req = mockReq({ isLpaUser: true });
		const res = {
			locals: {
				journeyResponse: {
					answers: {
						submitted: 'yes'
					},
					referenceId: '123'
				}
			},
			redirect: jest.fn()
		};

		checkNotSubmitted(LPA_DASHBOARD.APPEAL_OVERVIEW)(req, res, next);

		expect(res.redirect).toHaveBeenCalledWith(`${LPA_DASHBOARD.APPEAL_OVERVIEW}/123`);
	});
	it('should redirect to Rule 6 dashboard if submitted is yes and user is Rule 6', () => {
		const next = jest.fn();
		const req = mockReq({ isRule6User: true });
		const res = {
			locals: {
				journeyResponse: {
					answers: {
						submitted: 'yes'
					},
					referenceId: '456'
				}
			},
			redirect: jest.fn()
		};

		checkNotSubmitted(RULE_6.APPEAL_OVERVIEW)(req, res, next);

		expect(res.redirect).toHaveBeenCalledWith(`${RULE_6.APPEAL_OVERVIEW}/456`);
	});
	it('should redirect to appellant dashboard if submitted is yes and user is appellant', () => {
		const next = jest.fn();
		const req = mockReq();
		const res = {
			locals: {
				journeyResponse: {
					answers: {
						submitted: 'yes'
					},
					referenceId: '789'
				}
			},
			redirect: jest.fn()
		};

		checkNotSubmitted(SELECTED_APPEAL.APPEAL_OVERVIEW)(req, res, next);

		expect(res.redirect).toHaveBeenCalledWith(`${SELECTED_APPEAL.APPEAL_OVERVIEW}/789`);
	});
});
