const { isTokenValid } = require('../../../src/lib/is-token-valid');
const { checkToken } = require('../../../src/lib/appeals-api-wrapper');
const { isTokenExpired } = require('../../../src/lib/is-token-expired');

jest.mock('../../../src/lib/appeals-api-wrapper');
jest.mock('../../../src/lib/is-token-expired');

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
			expect(result).toBe(false);
		});
		it('should return false without calling checkToken or isTokenExpired if token parameter is missing', async () => {
			checkToken.mockReturnValue(undefined);

			const result = await isTokenValid('e2813fb0-e269-4fe2-890e-6405dbd4a5ea', undefined);

			expect(checkToken).not.toBeCalled();
			expect(isTokenExpired).not.toBeCalled();
			expect(result).toBe(false);
		});
		it('should return false without calling checkToken or isTokenExpired if id parameter is empty', async () => {
			checkToken.mockReturnValue(undefined);

			const result = await isTokenValid('', '63654');

			expect(checkToken).not.toBeCalled();
			expect(isTokenExpired).not.toBeCalled();
			expect(result).toBe(false);
		});
		it('should return false without calling checkToken or isTokenExpired if token parameter is empty', async () => {
			checkToken.mockReturnValue(undefined);

			const result = await isTokenValid('e2813fb0-e269-4fe2-890e-6405dbd4a5ea', '');

			expect(checkToken).not.toBeCalled();
			expect(isTokenExpired).not.toBeCalled();
			expect(result).toBe(false);
		});
		it('should return false without calling checkToken or isTokenExpired if id parameter is of an unexpected type', async () => {
			checkToken.mockReturnValue(undefined);

			const result = await isTokenValid({}, '63654');

			expect(checkToken).not.toBeCalled();
			expect(isTokenExpired).not.toBeCalled();
			expect(result).toBe(false);
		});
		it('should return false without calling checkToken or isTokenExpired if token parameter is of an unexpected type', async () => {
			checkToken.mockReturnValue(undefined);

			const result = await isTokenValid('e2813fb0-e269-4fe2-890e-6405dbd4a5ea', {});

			expect(checkToken).not.toBeCalled();
			expect(isTokenExpired).not.toBeCalled();
			expect(result).toBe(false);
		});
		it('should call checkToken if both parameters are valid', async () => {
			checkToken.mockReturnValue(undefined);

			await isTokenValid('e2813fb0-e269-4fe2-890e-6405dbd4a5ea', '63654');

			expect(checkToken).toBeCalledWith('e2813fb0-e269-4fe2-890e-6405dbd4a5ea', '63654');
		});
		it('should return false without calling isTokenExpired if returned token document is undefined', async () => {
			checkToken.mockReturnValue(undefined);

			const result = await isTokenValid('e2813fb0-e269-4fe2-890e-6405dbd4a5ea', '63654');

			expect(checkToken).toBeCalledWith('e2813fb0-e269-4fe2-890e-6405dbd4a5ea', '63654');
			expect(isTokenExpired).not.toBeCalled();
			expect(result).toBe(false);
		});
		it('should return false without calling isTokenExpired if returned token document is missing id prop', async () => {
			checkToken.mockReturnValue({
				createdAt: '2023-03-17T15:47:55.654Z'
			});

			const result = await isTokenValid('e2813fb0-e269-4fe2-890e-6405dbd4a5ea', '63654');
			expect(isTokenExpired).not.toBeCalled();
			expect(result).toBe(false);
		});
		it('should return false without calling isTokenExpired if returned token document is missing createdAt prop', async () => {
			checkToken.mockReturnValue({
				id: 'e2813fb0-e269-4fe2-890e-6405dbd4a5ea'
			});

			const result = await isTokenValid('e2813fb0-e269-4fe2-890e-6405dbd4a5ea', '63654');
			expect(isTokenExpired).not.toBeCalled();
			expect(result).toBe(false);
		});
		it('should return false without calling isTokenExpired if id in returned token document does not match id parameter', async () => {
			checkToken.mockReturnValue({
				id: 'non-matching-id-value',
				createdAt: '2023-03-17T15:47:55.654Z'
			});

			const result = await isTokenValid('e2813fb0-e269-4fe2-890e-6405dbd4a5ea', '63654');
			expect(isTokenExpired).not.toBeCalled();
			expect(result).toBe(false);
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
			expect(result).toBe(false);
		});
		it('should return true if returned token document id matches id parameter and isTokenExpired returns false', async () => {
			checkToken.mockReturnValue({
				id: 'e2813fb0-e269-4fe2-890e-6405dbd4a5ea',
				createdAt: '2023-03-17T15:47:55.654Z'
			});
			isTokenExpired.mockReturnValue(false);

			const result = await isTokenValid('e2813fb0-e269-4fe2-890e-6405dbd4a5ea', '63654');
			expect(result).toBe(true);
		});
	});
});