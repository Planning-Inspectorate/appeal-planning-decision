const {
	setLocalslDisplayCookieBannerValue
} = require('../../../src/middleware/set-locals-display-cookie-banner-value');

describe('middleware/set-locals-display-cookie-banner-value', () => {
	describe('#setLocalslDisplayCookieBannerValue', () => {
		describe('When assigning a value to the display cookie banner locals variable', () => {
			describe('and the cookie policy is defined', () => {
				const mockReq = {
					cookies: {
						cookie_policy: 'mock cookie policy'
					}
				};

				const mockRes = {
					locals: {}
				};

				const mockNext = jest.fn();

				beforeEach(() => {
					setLocalslDisplayCookieBannerValue(mockReq, mockRes, mockNext);
				});

				it('should add the displayCookieBanner key with a value of false to the mockRes locals key', () => {
					expect(mockRes.locals).toEqual({ displayCookieBanner: false });
				});

				it('should', () => {
					expect(mockNext).toHaveBeenCalled();
				});
			});
			describe('and the cookie policy is not defined', () => {
				const mockReq = {
					cookies: {}
				};

				const mockRes = {
					locals: {}
				};

				const mockNext = jest.fn();

				beforeEach(() => {
					setLocalslDisplayCookieBannerValue(mockReq, mockRes, mockNext);
				});

				it('should add the displayCookieBanner key with a value of false to the mockRes locals key', () => {
					expect(mockRes.locals).toEqual({ displayCookieBanner: true });
				});

				it('should', () => {
					expect(mockNext).toHaveBeenCalled();
				});
			});
		});
	});
});
