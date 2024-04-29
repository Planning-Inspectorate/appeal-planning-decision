const checkNotSubmitted = require('./check-not-submitted');

const testUrl = '/test';

describe('dynamic-forms/middleware/check-not-submitted', () => {
	let mockReq;

	beforeEach(() => {
		mockReq = () => ({
			cookies: {},
			log: {},
			params: {}
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
});
