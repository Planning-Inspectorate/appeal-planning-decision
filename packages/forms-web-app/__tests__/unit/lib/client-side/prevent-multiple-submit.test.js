/**
 * @jest-environment jsdom
 */
const {
	initialisePreventMultipleSubmit
} = require('../../../../src/lib/client-side/prevent-multiple-submit');

const mockAddEventListener = jest.fn();
const mockDocument = {
	addEventListener: mockAddEventListener
};

describe('lib/client-side/prevent-multiple-submit', () => {
	describe('initialisePreventMultipleSubmit', () => {
		beforeEach(() => {
			window.wfeconfig = {};
		});

		test('addEventListener should be called', () => {
			initialisePreventMultipleSubmit(mockDocument);
			expect(mockDocument.addEventListener).toHaveBeenCalledWith('submit', expect.any(Function));
		});
	});
});
