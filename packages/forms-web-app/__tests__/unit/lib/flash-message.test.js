const { addFlashMessage } = require('../../../src/lib/flash-message');

describe('lib/flash-message', () => {
	let req;

	let message1;
	let message2;
	let message3;

	beforeEach(() => {
		req = {
			session: {}
		};

		message1 = { a: 'b' };
		message2 = { c: 'd' };
		message3 = { e: 'f' };
	});

	it('should add one message to an empty array', () => {
		addFlashMessage(req, message1);
		expect(req.session.flashMessages).toEqual([message1]);
	});

	it('should add messages to an existing array', () => {
		addFlashMessage(req, message1);
		addFlashMessage(req, message2);
		expect(req.session.flashMessages).toEqual([message1, message2]);
		addFlashMessage(req, message3);
		expect(req.session.flashMessages).toEqual([message1, message2, message3]);
	});
});
