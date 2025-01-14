const { detailsRows } = require('./appeal-details-rows');
const { APPEAL_USER_ROLES, LPA_USER_ROLE } = require('@pins/common/src/constants');

describe('appeal-details-rows', () => {
	const appellant = {
		serviceUserType: APPEAL_USER_ROLES.APPELLANT,
		firstName: 'Appellant',
		lastName: 'Test'
	};
	const agent = { serviceUserType: APPEAL_USER_ROLES.AGENT, firstName: 'Agent', lastName: 'Test' };
	const caseWithAgent = { users: [agent, appellant] };
	const caseWithAppellant = { users: [appellant] };

	describe('in your name?', () => {
		const inYourNameIndex = 0;

		it('should display application in your name, if appellant/agent', () => {
			const rows = detailsRows(caseWithAppellant, APPEAL_USER_ROLES.APPELLANT);
			const rows2 = detailsRows(caseWithAppellant, APPEAL_USER_ROLES.AGENT);
			expect(rows[inYourNameIndex].keyText).toEqual('Was the application made in your name?');
			expect(rows[inYourNameIndex].valueText).toEqual('Yes');
			expect(rows2[inYourNameIndex].keyText).toEqual('Was the application made in your name?');
			expect(rows2[inYourNameIndex].valueText).toEqual('Yes');
		});

		it("should display application in appellant's name, if lpa", () => {
			const rows = detailsRows(caseWithAppellant, LPA_USER_ROLE);
			expect(rows[inYourNameIndex].keyText).toEqual(
				"Was the application made in the appellant's name"
			);
			expect(rows[inYourNameIndex].valueText).toEqual('Yes');
		});

		it('should display display No if agent', () => {
			const rows = detailsRows(caseWithAgent, APPEAL_USER_ROLES.APPELLANT);
			const rows2 = detailsRows(caseWithAgent, LPA_USER_ROLE);
			expect(rows[inYourNameIndex].valueText).toEqual('No');
			expect(rows2[inYourNameIndex].valueText).toEqual('No');
		});
	});

	describe("Applicant's name", () => {
		const nameIndex = 1;
		const contactIndex = 2;

		it("should display Applicant's and Agent name if agent on case", () => {
			const rows = detailsRows(caseWithAgent, APPEAL_USER_ROLES.APPELLANT);
			expect(rows[nameIndex].condition()).toEqual(true);
			expect(rows[nameIndex].valueText).toEqual('Appellant Test');
			expect(rows[contactIndex].valueText).toEqual('Agent Test');
		});

		it("should display only Applicant's name if no agent on case", () => {
			const rows = detailsRows(caseWithAppellant, APPEAL_USER_ROLES.APPELLANT);
			expect(rows[nameIndex].condition()).toEqual(false);
			expect(rows[contactIndex].valueText).toEqual('Appellant Test');
		});
	});

	describe('Agricultural holding', () => {
		const agriculturalIndex = 14;
		it('should not display Agricultural holding if null', () => {
			const test = structuredClone(caseWithAppellant);
			test.agriculturalHolding = null;
			const rows = detailsRows(test, APPEAL_USER_ROLES.APPELLANT);
			expect(rows[agriculturalIndex].condition()).toEqual(false);
			expect(rows[agriculturalIndex].keyText).toEqual('Agricultural holding');
		});

		it('should not display Agricultural holding if not null', () => {
			const test = structuredClone(caseWithAppellant);
			test.agriculturalHolding = false;
			const rows = detailsRows(test, APPEAL_USER_ROLES.APPELLANT);
			expect(rows[agriculturalIndex].condition()).toEqual(true);
			expect(rows[agriculturalIndex].keyText).toEqual('Agricultural holding');
			expect(rows[agriculturalIndex].valueText).toEqual('No');

			test.agriculturalHolding = true;
			const rows2 = detailsRows(test, APPEAL_USER_ROLES.APPELLANT);
			expect(rows2[agriculturalIndex].valueText).toEqual('Yes');
		});
	});
});
