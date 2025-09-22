const logger = {
	debug: jest.fn(),
	info: jest.fn(),
	warn: jest.fn(),
	error: jest.fn(),
	fatal: jest.fn(),
	trace: jest.fn()
};

logger.child = jest.fn(() => logger);

module.exports = logger;
