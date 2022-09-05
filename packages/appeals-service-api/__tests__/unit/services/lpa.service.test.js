const { getLpaById, createLpaList } = require('../../../src/services/lpa.service');
const mongodb = require('../../../src/db/db');

describe('services/lpa.service', () => {
	const lpaCode = 'E69999999';

	describe('getLpa', () => {
		it('should return the LPA when a LPA is found', async () => {
			mongodb.get = jest.fn(() => ({
				collection: jest.fn(() => ({
					findOne: jest.fn().mockResolvedValue({ email: 'lpa-email' })
				}))
			}));

			const lpa = await getLpaById(lpaCode);

			expect(lpa).toEqual({ email: 'lpa-email' });
		});

		it('should throw an error when a LPA is not found', () => {
			mongodb.get = jest.fn(() => ({
				collection: jest.fn(() => ({
					findOne: jest.fn().mockRejectedValue()
				}))
			}));
			expect(() => getLpaById(lpaCode)).rejects.toThrow(
				`Unable to find LPA email or name for code ${lpaCode}`
			);
		});

		it('should throw an error when a LPA without a name is found', () => {
			mongodb.get = jest.fn(() => ({
				collection: jest.fn(() => ({
					findOne: jest.fn().mockRejectedValue()
				}))
			}));
			expect(() => getLpaById(lpaCode)).rejects.toThrow(
				`Unable to find LPA email or name for code ${lpaCode}`
			);
		});

		it('should throw an error when a LPA without an email is found', () => {
			mongodb.get = jest.fn(() => ({
				collection: jest.fn(() => ({
					findOne: jest.fn().mockRejectedValue()
				}))
			}));
			expect(() => getLpaById(lpaCode)).rejects.toThrow(
				`Unable to find LPA email or name for code ${lpaCode}`
			);
		});
	});

	describe('createLpaList', () => {
		it('should create the lpa list from csv content', async () => {
			const result = [
				{
					objectId: '1',
					lpa19CD: 'E60000001',
					lpaCode: 'X1355',
					lpa19NM: 'County Durham',
					email: 'planning@durham.gov.uk',
					domain: 'durham.gov.uk',
					inTrial: true,
					england: true,
					wales: false
				},
				{
					objectId: '2',
					lpa19CD: 'E60000002',
					lpaCode: 'N1350',
					lpa19NM: 'Darlington',
					email: 'planning.enquiries@darlington.gov.uk',
					domain: 'darlington.gov.uk',
					inTrial: false,
					england: true,
					wales: false
				},
				{
					objectId: '3',
					lpa19CD: 'E60000003',
					lpaCode: 'H0724',
					lpa19NM: 'Hartlepool',
					email: 'developmentcontrol@hartlepool.gov.uk',
					domain: 'hartlepool.gov.uk',
					inTrial: false,
					england: true,
					wales: false
				}
			];

			const csv = `OBJECTID,LPA19CD,LPA CODE,LPA19NM,EMAIL,DOMAIN,LPA ONBOARDED
1,E60000001,X1355,County Durham,planning@durham.gov.uk,durham.gov.uk,TRUE
2,E60000002,N1350,Darlington,planning.enquiries@darlington.gov.uk,darlington.gov.uk,FALSE
3,E60000003,H0724,Hartlepool,developmentcontrol@hartlepool.gov.uk,hartlepool.gov.uk,FALSE`;

			expect(await createLpaList(csv)).toEqual(result);
		});
	});
});
