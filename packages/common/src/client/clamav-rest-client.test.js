// these are integration tests so can only be run with a running clamav host

const ClamAVClient = require('./clamav-rest-client');
const clamAVClient = new ClamAVClient('http://localhost:3100');

describe('clamav', () => {
	it.skip('should scan uploaded txt file with positive result', async () => {
		const file = {
			name: 'eicar.com.txt',
			tempFilePath: 'packages/common/__tests__/artifacts/eicar.com.txt'
		};

		await expect(() => clamAVClient.scan(file, file.name)).rejects.toThrowError(
			`${file.name} contains a virus`
		);
	});

	it.skip('should scan uploaded document with negative result', async () => {
		const file = {
			tempFilePath: 'packages/common/__tests__/artifacts/default.csv',
			name: 'default.csv'
		};

		const succesfullyUploaded = await clamAVClient.scan(file, file.name);
		expect(succesfullyUploaded).toBe(true);
	});
});
