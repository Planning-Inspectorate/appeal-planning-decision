const routerMock = (express) =>
	(express.Router = jest.fn().mockReturnValue({
		get: jest.fn(),
		post: jest.fn(),
		use: jest.fn(),
		put: jest.fn(),
		delete: jest.fn()
	}));

module.exports = {
	routerMock
};
