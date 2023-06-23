const { isTokenValid, testConfirmEmailToken } = require('../../../src/lib/is-token-valid');
const { checkToken } = require('../../../src/lib/appeals-api-wrapper');
const { isTokenExpired } = require('../../../src/lib/is-token-expired');
const { utils } = require('@pins/common');
const config = require('../../../src/config');

jest.mock('../../../src/lib/appeals-api-wrapper');
jest.mock('../../../src/lib/is-token-expired');
jest.mock('../../../src/config');
jest.mock('@pins/common');

describe('lib/is-token-valid', () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	describe('isTokenValid', () => {
		it('should return false without calling checkToken or isTokenExpired if id parameter is missing', async () => {
			checkToken.mockReturnValue(undefined);

			const result = await isTokenValid(undefined, '63654');

			expect(checkToken).not.toBeCalled();
			expect(isTokenExpired).not.toBeCalled();
			expect(result.valid).toBe(false);
		});
		it('should return false without calling checkToken or isTokenExpired if token parameter is missing', async () => {
			checkToken.mockReturnValue(undefined);

			const result = await isTokenValid('e2813fb0-e269-4fe2-890e-6405dbd4a5ea', undefined);

			expect(checkToken).not.toBeCalled();
			expect(isTokenExpired).not.toBeCalled();
			expect(result.valid).toBe(false);
		});
		it('should return false without calling checkToken or isTokenExpired if id parameter is empty', async () => {
			checkToken.mockReturnValue(undefined);

			const result = await isTokenValid('', '63654');

			expect(checkToken).not.toBeCalled();
			expect(isTokenExpired).not.toBeCalled();
			expect(result.valid).toBe(false);
		});
		it('should return false without calling checkToken or isTokenExpired if token parameter is empty', async () => {
			checkToken.mockReturnValue(undefined);

			const result = await isTokenValid('e2813fb0-e269-4fe2-890e-6405dbd4a5ea', '');

			expect(checkToken).not.toBeCalled();
			expect(isTokenExpired).not.toBeCalled();
			expect(result.valid).toBe(false);
		});
		it('should return false without calling checkToken or isTokenExpired if id parameter is of an unexpected type', async () => {
			checkToken.mockReturnValue(undefined);

			const result = await isTokenValid({}, '63654');

			expect(checkToken).not.toBeCalled();
			expect(isTokenExpired).not.toBeCalled();
			expect(result.valid).toBe(false);
		});
		it('should return false without calling checkToken or isTokenExpired if token parameter is of an unexpected type', async () => {
			checkToken.mockReturnValue(undefined);

			const result = await isTokenValid('e2813fb0-e269-4fe2-890e-6405dbd4a5ea', {});

			expect(checkToken).not.toBeCalled();
			expect(isTokenExpired).not.toBeCalled();
			expect(result.valid).toBe(false);
		});
		test.each([
			[[false, false, 'a']],
			[[true, false, 'a']],
			[[false, true, 'a']],
			[[true, true, 'a']],
			[[false, false, testConfirmEmailToken]],
			[[true, false, testConfirmEmailToken]],
			[[false, true, testConfirmEmailToken]]
			// [[true, true, utils.testLPACode]],
		])('should not skip if any testing params arent set', async (input) => {
			checkToken.mockReturnValue({
				id: 'abc',
				createdAt: '2023-03-17T15:47:55.654Z'
			});
			isTokenExpired.mockReturnValue(true);
			config.server = {
				allowTestingOverrides: input[0]
			};
			utils.isTestLPA.mockReturnValue(input[1]);
			const result = await isTokenValid('abc', input[2], {
				appeal: {
					lpaCode: 'something'
				}
			});

			expect(result.valid).toBe(false);
			expect(checkToken).toHaveBeenCalledTimes(1);
			expect(isTokenExpired).toHaveBeenCalledTimes(1);
		});
		it('should return false if too many attempts', async () => {
			const tooManyAttempts = new Error('Too Many Requests');
			checkToken.mockImplementation(() => {
				throw tooManyAttempts;
			});
			isTokenExpired.mockReturnValue(false);

			const result = await isTokenValid('e2813fb0-e269-4fe2-890e-6405dbd4a5ea', '63654', {
				enterCode: { action: 'saveAndReturn' }
			});
			expect(result.valid).toBe(false);
			expect(result.tooManyAttempts).toBe(true);
			expect(result.action).toBe('saveAndReturn');
		});
		it('should call checkToken if both parameters are valid', async () => {
			checkToken.mockReturnValue(undefined);

			await isTokenValid('e2813fb0-e269-4fe2-890e-6405dbd4a5ea', '63654', {
				enterCode: { action: 'test' }
			});

			expect(checkToken).toBeCalledWith('e2813fb0-e269-4fe2-890e-6405dbd4a5ea', '63654', 'test');
		});
		it('should return false without calling isTokenExpired if returned token document is undefined', async () => {
			checkToken.mockReturnValue(undefined);

			const result = await isTokenValid('e2813fb0-e269-4fe2-890e-6405dbd4a5ea', '63654', undefined);

			expect(checkToken).toBeCalledWith('e2813fb0-e269-4fe2-890e-6405dbd4a5ea', '63654', undefined);
			expect(isTokenExpired).not.toBeCalled();
			expect(result.valid).toBe(false);
		});
		it('should return false without calling isTokenExpired if returned token document is missing id prop', async () => {
			checkToken.mockReturnValue({
				createdAt: '2023-03-17T15:47:55.654Z'
			});
			isTokenExpired.mockReturnValue(true);
			const result = await isTokenValid('e2813fb0-e269-4fe2-890e-6405dbd4a5ea', '63654');
			expect(isTokenExpired).toBeCalled();
			expect(result.valid).toBe(false);
		});
		it('should return false if returned token document is missing createdAt prop', async () => {
			checkToken.mockReturnValue({
				id: 'e2813fb0-e269-4fe2-890e-6405dbd4a5ea'
			});
			isTokenExpired.mockReturnValue(true);
			const result = await isTokenValid('e2813fb0-e269-4fe2-890e-6405dbd4a5ea', '63654');
			expect(isTokenExpired).toBeCalled();
			expect(result.valid).toBe(false);
		});
		it('should return false if id in returned token document does not match id parameter', async () => {
			checkToken.mockReturnValue({
				id: 'non-matching-id-value',
				createdAt: '2023-03-17T15:47:55.654Z'
			});
			isTokenExpired.mockReturnValue(true);
			const result = await isTokenValid('e2813fb0-e269-4fe2-890e-6405dbd4a5ea', '63654');
			expect(isTokenExpired).toBeCalled();
			expect(result.valid).toBe(false);
		});
		it('should call isTokenExpired if checkToken returns a token document containing a correct id and createdAt prop', async () => {
			checkToken.mockReturnValue({
				id: 'e2813fb0-e269-4fe2-890e-6405dbd4a5ea',
				createdAt: '2023-03-17T15:47:55.654Z'
			});

			await isTokenValid('e2813fb0-e269-4fe2-890e-6405dbd4a5ea', '63654');
			expect(isTokenExpired).toBeCalledWith(30, new Date('2023-03-17T15:47:55.654Z'));
		});
		it('should return false if returned token document id matches id parameter but isTokenExpired returns true', async () => {
			checkToken.mockReturnValue({
				id: 'e2813fb0-e269-4fe2-890e-6405dbd4a5ea',
				createdAt: '2023-03-17T15:47:55.654Z'
			});
			isTokenExpired.mockReturnValue(true);

			const result = await isTokenValid('e2813fb0-e269-4fe2-890e-6405dbd4a5ea', '63654');
			expect(result.valid).toBe(false);
		});
		it('should return true if returned token document id matches id parameter and isTokenExpired returns false', async () => {
			checkToken.mockReturnValue({
				id: 'e2813fb0-e269-4fe2-890e-6405dbd4a5ea',
				createdAt: '2023-03-17T15:47:55.654Z'
			});
			isTokenExpired.mockReturnValue(false);

			const result = await isTokenValid('e2813fb0-e269-4fe2-890e-6405dbd4a5ea', '63654');
			expect(result.valid).toBe(true);
		});
	});
});
