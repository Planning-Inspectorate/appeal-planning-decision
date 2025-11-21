const csvMock = `OBJECTID;LPA19CD;LPA CODE;LPA19NM;EMAIL;DOMAIN;LPA ONBOARDED
8;E00000151;A0001;Test 1 County;test@test1county.gov.uk;test1county.gov.uk;TRUE
9;E00000152;A0002;Test 2 County;test@test2county.gov.uk;test2county.gov.uk;TRUE
10;E00000153;A0003;Test 3 County;test@test3county.gov.uk;test3county.gov.uk;TRUE
11;E00000154;A0004;Test 4 County;test@test4county.gov.uk;test4county.gov.uk;TRUE
12;E00000155;A0005;Test 5 County;test@test5county.gov.u;test5county.gov.uk;TRUE`;

function containsAny(arr1, arr2) {
	return arr1.some((item) => arr2.includes(item));
}

/**
 * @param {Object} dependencies
 * @param {function(): import('@pins/database/src/client').PrismaClient} dependencies.getSqlClient
 * @param {import('supertest').Agent} dependencies.appealsApi
 */
module.exports = ({ getSqlClient, appealsApi: lpaApi }) => {
	const sqlClient = getSqlClient();

	describe('LPAs v2', () => {
		describe('upload LPAs', () => {
			it('should upload upload all LPAs to the DB without error', async () => {
				const response = await lpaApi.post('/api/v2/lpa').send({
					csvMock
				});
				const getResponse = await lpaApi.get(`/api/v2/lpa`);
				expect(response.status).toBe(200);
				expect(getResponse.status).toBe(200);
				expect(getResponse.body.length).toBe(5);
			});

			it('should delete existing data and reupload without error', async () => {
				const response1 = await lpaApi.post('/api/v2/lpa').send({
					csvMock
				});
				const getResponse1 = await lpaApi.get(`/api/v2/lpa`);
				const response2 = await lpaApi.post('/api/v2/lpa').send({
					csvMock
				});
				const getResponse2 = await lpaApi.get(`/api/v2/lpa`);

				expect(response1.status).toBe(200);
				expect(response2.status).toBe(200);
				expect(getResponse1.status).toBe(200);
				expect(getResponse2.status).toBe(200);
				const doesContain = containsAny(
					getResponse1.body.map((x) => x.id),
					getResponse2.body.map((y) => y.id)
				);
				expect(doesContain).toBeFalsy();
				expect(getResponse2.body.length).toBe(5);
			});
		});

		describe('get LPA', () => {
			beforeAll(async () => {
				await sqlClient.lPA.deleteMany({});
				await sqlClient.lPA.createMany({
					data: [
						{
							domain: 'test.com',
							email: 'test1@test.com',
							inTrial: true,
							lpa19CD: 'E60000001',
							name: 'Test1',
							lpaCode: 'A1355',
							objectId: '1'
						},
						{
							domain: 'test.com',
							email: 'test2@test.com',
							inTrial: false,
							lpa19CD: 'E60000002',
							name: 'Test2',
							lpaCode: 'B1355',
							objectId: '2'
						}
					]
				});
			});

			it('should get all LPAs', async () => {
				const response = await lpaApi.get(`/api/v2/lpa`);
				expect(response.status).toBe(200);
				expect(response.body.length).toBe(2);
			});

			it('should get LPA by id', async () => {
				const allResponse = await lpaApi.get(`/api/v2/lpa`);
				let testId = allResponse.body[0].id;
				let testinTrial = allResponse.body[0].inTrial;
				let testEmail = allResponse.body[0].email;
				let testLpa19CD = allResponse.body[0].lpa19CD;
				let testLpaCode = allResponse.body[0].lpaCode;
				let testObjectId = allResponse.body[0].objectId;

				const response = await lpaApi.get(`/api/v2/lpa/${testId}`);

				expect(response.status).toBe(200);
				expect(response.body).toHaveProperty('id', testId);
				expect(response.body).toHaveProperty('inTrial', testinTrial);
				expect(response.body).toHaveProperty('email', testEmail);
				expect(response.body).toHaveProperty('lpa19CD', testLpa19CD);
				expect(response.body).toHaveProperty('lpaCode', testLpaCode);
				expect(response.body).toHaveProperty('objectId', testObjectId);
			});

			it('should fail to get LPA by id', async () => {
				const testId = '00000000-0000-00000-00000-0000000002';
				const response = await lpaApi.get(`/api/v2/lpa/${testId}`);

				expect(response.status).toBe(404);
			});

			it('should get LPA by lpaCode', async () => {
				const testCode = 'A1355';

				const response = await lpaApi.get(`/api/v2/lpa/lpaCode/${testCode}`);

				expect(response.status).toBe(200);
				expect(response.body).toHaveProperty('inTrial', true);
				expect(response.body).toHaveProperty('email', 'test1@test.com');
				expect(response.body).toHaveProperty('lpa19CD', 'E60000001');
				expect(response.body).toHaveProperty('lpaCode', testCode);
				expect(response.body).toHaveProperty('objectId', '1');
			});

			it('should fail to get LPA by lpaCode', async () => {
				const testCode = 'A1356';

				const response = await lpaApi.get(`/api/v2/lpa/lpaCode/${testCode}`);
				expect(response.status).toBe(404);
			});

			it('should get LPA by lpa19CD', async () => {
				const testlpa19CD = 'E60000001';

				const response = await lpaApi.get(`/api/v2/lpa/lpa19CD/${testlpa19CD}`);
				expect(response.status).toBe(200);
				expect(response.body).toHaveProperty('email', 'test1@test.com');
				expect(response.body).toHaveProperty('lpa19CD', testlpa19CD);
				expect(response.body).toHaveProperty('lpaCode', 'A1355');
				expect(response.body).toHaveProperty('objectId', '1');
				expect(response.body).toHaveProperty('inTrial', true);
			});

			it('should fail to get LPA by lpa19CD', async () => {
				const testlpa19CD = 'E60000003';
				const response = await lpaApi.get(`/api/v2/lpa/lpa19CD/${testlpa19CD}`);

				expect(response.status).toBe(404);
			});
		});
	});
};
