const { isTokenValid } = require('../../../src/lib/is-token-valid');
const { checkToken } = require('../../../src/lib/appeals-api-wrapper');
const { isTokenExpired } = require('../../../src/lib/is-token-expired');
const { utils } = require('@pins/common');
const config = require('../../../src/config');

jest.mock('../../../src/lib/appeals-api-wrapper');
jest.mock('../../../src/lib/is-token-expired');
jest.mock('../../../src/config');
jest.mock('@pins/common');

const CODE = '63654';
const ID = 'e2813fb0-e269-4fe2-890e-6405dbd4a5ea';

describe('lib/is-token-valid', () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	describe('isTokenValid', () => {
		it('should return false without calling checkToken or isTokenExpired if id parameter is missing', async () => {
			checkToken.mockReturnValue(undefined);

			const result = await isTokenValid(CODE);

			expect(checkToken).not.toBeCalled();
			expect(isTokenExpired).not.toBeCalled();
			expect(result.valid).toBe(false);
		});
		it('should return false without calling checkToken or isTokenExpired if token parameter is missing', async () => {
			checkToken.mockReturnValue(undefined);

			const result = await isTokenValid(undefined, ID);

			expect(checkToken).not.toBeCalled();
			expect(isTokenExpired).not.toBeCalled();
			expect(result.valid).toBe(false);
		});
		it('should return false without calling checkToken or isTokenExpired if id parameter is empty', async () => {
			checkToken.mockReturnValue(undefined);

			const result = await isTokenValid(CODE, '');

			expect(checkToken).not.toBeCalled();
			expect(isTokenExpired).not.toBeCalled();
			expect(result.valid).toBe(false);
		});
		it('should return false without calling checkToken or isTokenExpired if token parameter is empty', async () => {
			checkToken.mockReturnValue(undefined);

			const result = await isTokenValid('', ID);

			expect(checkToken).not.toBeCalled();
			expect(isTokenExpired).not.toBeCalled();
			expect(result.valid).toBe(false);
		});
		it('should return false without calling checkToken or isTokenExpired if id parameter is of an unexpected type', async () => {
			checkToken.mockReturnValue(undefined);

			const result = await isTokenValid(CODE, {});

			expect(checkToken).not.toBeCalled();
			expect(isTokenExpired).not.toBeCalled();
			expect(result.valid).toBe(false);
		});
		it('should return false without calling checkToken or isTokenExpired if token parameter is of an unexpected type', async () => {
			checkToken.mockReturnValue(undefined);

			const result = await isTokenValid({}, ID);

			expect(checkToken).not.toBeCalled();
			expect(isTokenExpired).not.toBeCalled();
			expect(result.valid).toBe(false);
		});

		const getAllowTestScenario = (allowTestingOverrides, isTestLpa, token) => ({
			allowTestingOverrides,
			isTestLpa,
			token
		});

		test.each([
			[getAllowTestScenario(false, false, 'a')],
			[getAllowTestScenario(true, false, 'a')],
			[getAllowTestScenario(false, true, 'a')],
			[getAllowTestScenario(true, true, 'a')],
			[getAllowTestScenario(false, false, '12345')],
			[getAllowTestScenario(true, false, '12345')],
			[getAllowTestScenario(false, true, '12345')]
		])(
			'should not skip if any testing params arent set',
			async ({ allowTestingOverrides, isTestLpa, token }) => {
				checkToken.mockReturnValue({
					id: 'abc',
					createdAt: '2023-03-17T15:47:55.654Z'
				});
				isTokenExpired.mockReturnValue(true);

				config.server = {
					allowTestingOverrides: allowTestingOverrides
				};
				utils.isTestLPA.mockReturnValue(isTestLpa);

				const result = await isTokenValid(token, 'id', 'email', 'action', 'lpa-code');

				expect(result.valid).toBe(false);
				expect(checkToken).toHaveBeenCalledTimes(1);
				expect(isTokenExpired).toHaveBeenCalledTimes(1);
			}
		);

		it('should return false if too many attempts', async () => {
			const tooManyAttempts = new Error('Too Many Requests');
			checkToken.mockImplementation(() => {
				throw tooManyAttempts;
			});
			isTokenExpired.mockReturnValue(false);

			const result = await isTokenValid(CODE, ID, '', 'saveAndReturn');
			expect(result.valid).toBe(false);
			expect(result.tooManyAttempts).toBe(true);
			expect(result.action).toBe('saveAndReturn');
		});
		it('should call checkToken if both parameters are valid', async () => {
			checkToken.mockReturnValue(undefined);

			await isTokenValid(ID, CODE, '');

			expect(checkToken).toBeCalledWith(ID, CODE, '');
		});
		it('should return false without calling isTokenExpired if returned token document is undefined', async () => {
			checkToken.mockReturnValue(undefined);

			const result = await isTokenValid(CODE, ID, '');

			expect(checkToken).toBeCalledWith(CODE, ID, '');
			expect(isTokenExpired).not.toBeCalled();
			expect(result.valid).toBe(false);
		});
		it('should return false without calling isTokenExpired if returned token document is missing id prop', async () => {
			checkToken.mockReturnValue({
				createdAt: '2023-03-17T15:47:55.654Z'
			});
			isTokenExpired.mockReturnValue(true);
			const result = await isTokenValid(CODE, ID);
			expect(isTokenExpired).toBeCalled();
			expect(result.valid).toBe(false);
		});
		it('should return false if returned token document is missing createdAt prop', async () => {
			checkToken.mockReturnValue({
				id: ID
			});
			isTokenExpired.mockReturnValue(true);
			const result = await isTokenValid(CODE, ID);
			expect(isTokenExpired).toBeCalled();
			expect(result.valid).toBe(false);
		});
		it('should return false if id in returned token document does not match id parameter', async () => {
			checkToken.mockReturnValue({
				id: 'non-matching-id-value',
				createdAt: '2023-03-17T15:47:55.654Z'
			});
			isTokenExpired.mockReturnValue(true);
			const result = await isTokenValid(CODE, ID);
			expect(isTokenExpired).toBeCalled();
			expect(result.valid).toBe(false);
		});
		it('should call isTokenExpired if checkToken returns a token document containing a correct id and createdAt prop', async () => {
			checkToken.mockReturnValue({
				id: ID,
				createdAt: '2023-03-17T15:47:55.654Z'
			});

			await isTokenValid(CODE, ID);
			expect(isTokenExpired).toBeCalledWith(30, new Date('2023-03-17T15:47:55.654Z'));
		});
		it('should return false if returned token document id matches id parameter but isTokenExpired returns true', async () => {
			checkToken.mockReturnValue({
				id: ID,
				createdAt: '2023-03-17T15:47:55.654Z'
			});
			isTokenExpired.mockReturnValue(true);

			const result = await isTokenValid(CODE, ID);
			expect(result.valid).toBe(false);
		});
		it('should return true if returned token document id matches id parameter and isTokenExpired returns false', async () => {
			checkToken.mockReturnValue({
				id: ID,
				createdAt: '2023-03-17T15:47:55.654Z'
			});
			isTokenExpired.mockReturnValue(false);

			const result = await isTokenValid(CODE, ID);
			expect(result.valid).toBe(true);
		});
	});
});
