const { detailsRows } = require('./appeal-details-rows');
const { APPEAL_USER_ROLES, LPA_USER_ROLE } = require('@pins/common/src/constants');

describe('appeal-details-rows', () => {
	const appellant = {
		serviceUserType: APPEAL_USER_ROLES.APPELLANT,
		firstName: 'Appellant',
		lastName: 'Test',
		telephoneNumber: '12345'
	};
	const agent = {
		serviceUserType: APPEAL_USER_ROLES.AGENT,
		firstName: 'Agent',
		lastName: 'Test',
		telephoneNumber: '98765'
	};
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

	describe('Phone number', () => {
		const phoneIndex = 3;

		it("should display appellant's phone number if no agent on case", () => {
			const rows = detailsRows(caseWithAppellant, APPEAL_USER_ROLES.APPELLANT);
			expect(rows[phoneIndex].valueText).toEqual('12345');
		});

		it("should display agent's phone number if agent on case", () => {
			const rows = detailsRows(caseWithAgent, APPEAL_USER_ROLES.APPELLANT);
			expect(rows[phoneIndex].valueText).toEqual('98765');
		});
	});

	describe('Site address', () => {
		it('should display address', () => {
			const siteAddressIndex = 4;
			let testCase = structuredClone(caseWithAppellant);
			testCase.siteAddressLine1 = 'Test address';
			testCase.siteAddressTown = 'Testville';
			testCase.siteAddressPostcode = 'TS1 1TT';
			const rows = detailsRows(testCase, APPEAL_USER_ROLES.APPELLANT);

			expect(rows[siteAddressIndex].condition(testCase)).toBeTruthy();
			expect(rows[siteAddressIndex].valueText).toEqual('Test address\nTestville\nTS1 1TT');
		});
	});

	describe('What is the area of the appeal site', () => {
		const siteAreaIndex = 5;

		it('should display appeal site area if not null', () => {
			const testCase = structuredClone(caseWithAppellant);
			testCase.siteAreaSquareMetres = 1.5;
			const rows = detailsRows(testCase, APPEAL_USER_ROLES.APPELLANT);

			expect(rows[siteAreaIndex].condition(testCase)).toEqual(true);
			expect(rows[siteAreaIndex].valueText).toEqual('1.5 m\u00B2');
		});

		it('should not display appeal site area if  null', () => {
			let testCase = structuredClone(caseWithAppellant);
			const rows = detailsRows(testCase, APPEAL_USER_ROLES.APPELLANT);
			expect(rows[siteAreaIndex].condition(testCase)).toEqual(false);
		});
	});

	describe('Is the site in a green belt', () => {
		const greenBeltIndex = 6;

		it('should show Green Belt if not null', () => {
			const testCase = structuredClone(caseWithAppellant);

			testCase.isGreenBelt = true;

			const rows = detailsRows(testCase, APPEAL_USER_ROLES.APPELLANT);
			expect(rows[greenBeltIndex].condition(testCase)).toEqual(true);
			expect(rows[greenBeltIndex].valueText).toEqual('Yes');

			testCase.isGreenBelt = false;
			const rows2 = detailsRows(testCase, APPEAL_USER_ROLES.APPELLANT);
			expect(rows2[greenBeltIndex].condition(testCase)).toEqual(true);
			expect(rows2[greenBeltIndex].valueText).toEqual('No');
		});

		it('should not show Green Belt if null', () => {
			const testCase = structuredClone(caseWithAppellant);

			const rows = detailsRows(testCase, APPEAL_USER_ROLES.APPELLANT);

			expect(rows[greenBeltIndex].condition(testCase)).toEqual(false);
			expect(rows[greenBeltIndex].valueText).toEqual('');
		});
	});

	describe('Site fully owned', () => {
		const fullyOwnedIndex = 7;

		it('should show Site fully owned if not null', () => {
			const testCase = structuredClone(caseWithAppellant);

			testCase.ownsAllLand = true;

			const rows = detailsRows(testCase, APPEAL_USER_ROLES.APPELLANT);
			expect(rows[fullyOwnedIndex].condition(testCase)).toEqual(true);
			expect(rows[fullyOwnedIndex].valueText).toEqual('Yes');

			testCase.ownsAllLand = false;
			const rows2 = detailsRows(testCase, APPEAL_USER_ROLES.APPELLANT);
			expect(rows2[fullyOwnedIndex].condition(testCase)).toEqual(true);
			expect(rows2[fullyOwnedIndex].valueText).toEqual('No');
		});

		it('should not show Site Fully Owned if null', () => {
			const testCase = structuredClone(caseWithAppellant);

			const rows = detailsRows(testCase, APPEAL_USER_ROLES.APPELLANT);

			expect(rows[fullyOwnedIndex].condition(testCase)).toEqual(false);
			expect(rows[fullyOwnedIndex].valueText).toEqual('');
		});
	});

	describe('Site partly owned', () => {
		const partlyOwnedIndex = 8;

		it('should show Site Partly Owned if not null', () => {
			const testCase = structuredClone(caseWithAppellant);

			testCase.ownsSomeLand = true;

			const rows = detailsRows(testCase, APPEAL_USER_ROLES.APPELLANT);
			expect(rows[partlyOwnedIndex].condition(testCase)).toEqual(true);
			expect(rows[partlyOwnedIndex].valueText).toEqual('Yes');

			testCase.ownsSomeLand = false;
			const rows2 = detailsRows(testCase, APPEAL_USER_ROLES.APPELLANT);
			expect(rows2[partlyOwnedIndex].condition(testCase)).toEqual(true);
			expect(rows2[partlyOwnedIndex].valueText).toEqual('No');
		});

		it('should not show Site Partly Owned if null', () => {
			const testCase = structuredClone(caseWithAppellant);

			const rows = detailsRows(testCase, APPEAL_USER_ROLES.APPELLANT);

			expect(rows[partlyOwnedIndex].condition(testCase)).toEqual(false);
			expect(rows[partlyOwnedIndex].valueText).toEqual('');
		});
	});

	describe('Other owners known', () => {
		const otherOwnersIndex = 9;

		it('should show Other Owners Known if not null', () => {
			const testCase = structuredClone(caseWithAppellant);

			testCase.knowsOtherOwners = 'Yes';

			const rows = detailsRows(testCase, APPEAL_USER_ROLES.APPELLANT);
			expect(rows[otherOwnersIndex].condition(testCase)).toEqual(true);
			expect(rows[otherOwnersIndex].valueText).toEqual('Yes');

			testCase.knowsOtherOwners = 'No';
			const rows2 = detailsRows(testCase, APPEAL_USER_ROLES.APPELLANT);
			expect(rows2[otherOwnersIndex].condition(testCase)).toEqual(true);
			expect(rows2[otherOwnersIndex].valueText).toEqual('No');

			testCase.knowsOtherOwners = 'Some';
			const rows3 = detailsRows(testCase, APPEAL_USER_ROLES.APPELLANT);
			expect(rows3[otherOwnersIndex].condition(testCase)).toEqual(true);
			expect(rows3[otherOwnersIndex].valueText).toEqual('Some');
		});

		it('should not show Other Owners Known if null', () => {
			const testCase = structuredClone(caseWithAppellant);

			const rows = detailsRows(testCase, APPEAL_USER_ROLES.APPELLANT);

			expect(rows[otherOwnersIndex].condition(testCase)).toEqual(false);
			expect(rows[otherOwnersIndex].valueText).toEqual('');
		});
	});

	describe('Other owners identified and Advertised Appeal', () => {
		const otherOwnersIdentifiedIndex = 10;
		const advertisedAppealIndex = 11;

		it('should display Other Owners Identified and Advertised Appeal if advertised appeal', () => {
			const testCase = structuredClone(caseWithAppellant);
			testCase.advertisedAppeal = true;
			const rows = detailsRows(testCase, APPEAL_USER_ROLES.APPELLANT);
			expect(rows[otherOwnersIdentifiedIndex].condition(testCase)).toEqual(true);
			expect(rows[otherOwnersIdentifiedIndex].valueText).toEqual('Yes');
			expect(rows[advertisedAppealIndex].condition(testCase)).toEqual(true);
			expect(rows[advertisedAppealIndex].valueText).toEqual('Yes');
		});

		it('should not display Other Owners Identified and Advertised Appeal if not advertised appeal', () => {
			const testCase = structuredClone(caseWithAppellant);

			const rows = detailsRows(testCase, APPEAL_USER_ROLES.APPELLANT);
			expect(rows[otherOwnersIdentifiedIndex].condition(testCase)).toBeFalsy();
			expect(rows[advertisedAppealIndex].condition(testCase)).toBeFalsy();

			testCase.advertisedAppeal = false;
			const rows2 = detailsRows(testCase, APPEAL_USER_ROLES.APPELLANT);
			expect(rows2[otherOwnersIdentifiedIndex].condition(testCase)).toEqual(false);
			expect(rows2[advertisedAppealIndex].condition(testCase)).toEqual(false);
		});
	});

	describe('Other owners informed', () => {
		const otherOwnersInformedIndex = 12;

		it('should display Advertised Appeal if advertised appeal', () => {
			const testCase = structuredClone(caseWithAppellant);
			testCase.ownersInformed = true;
			const rows = detailsRows(testCase, APPEAL_USER_ROLES.APPELLANT);
			expect(rows[otherOwnersInformedIndex].condition(testCase)).toEqual(true);
			expect(rows[otherOwnersInformedIndex].valueText).toEqual('Yes');
		});

		it('should not display Advertised Appeal if not advertised appeal', () => {
			const testCase = structuredClone(caseWithAppellant);

			const rows = detailsRows(testCase, APPEAL_USER_ROLES.APPELLANT);
			expect(rows[otherOwnersInformedIndex].condition(testCase)).toBeFalsy();

			testCase.ownersInformed = false;
			const rows2 = detailsRows(testCase, APPEAL_USER_ROLES.APPELLANT);
			expect(rows2[otherOwnersInformedIndex].condition(testCase)).toEqual(false);
		});
	});

	describe('Will an inspector need to access the land or property?', () => {
		const inspectorAccessIndex = 13;

		it('should display Inspector access details if provided by applicant', () => {
			const testCase = structuredClone(caseWithAppellant);
			testCase.siteAccessDetails = ['Some details'];
			const rows = detailsRows(testCase, APPEAL_USER_ROLES.APPELLANT);
			expect(rows[inspectorAccessIndex].valueText).toEqual('Yes \n Some details');
		});

		it('should display no if no access details provided by Applicant', () => {
			const testCase = structuredClone(caseWithAppellant);

			const rows = detailsRows(testCase, APPEAL_USER_ROLES.APPELLANT);
			expect(rows[inspectorAccessIndex].valueText).toEqual('No');

			testCase.siteAccessDetails = [null, 'LPA details'];
			const rows2 = detailsRows(testCase, APPEAL_USER_ROLES.APPELLANT);
			expect(rows2[inspectorAccessIndex].valueText).toEqual('No');
		});
	});

	// describe("Agricultural holding", () => {
	// 	const nameIndex = 1;
	// 	const contactIndex = 2;

	// 	it("should display Applicant's and Agent name if agent on case", () => {
	// 		const rows = detailsRows(caseWithAgent, APPEAL_USER_ROLES.APPELLANT);
	// 		expect(rows[nameIndex].condition()).toEqual(true);
	// 		expect(rows[nameIndex].valueText).toEqual('Appellant Test');
	// 		expect(rows[contactIndex].valueText).toEqual('Agent Test');
	// 	});

	// 	it("should display only Applicant's name if no agent on case", () => {
	// 		const rows = detailsRows(caseWithAppellant, APPEAL_USER_ROLES.APPELLANT);
	// 		expect(rows[nameIndex].condition()).toEqual(false);
	// 		expect(rows[contactIndex].valueText).toEqual('Appellant Test');
	// 	});
	// });

	// describe("Tenant on agricultural holding", () => {
	// 	const nameIndex = 1;
	// 	const contactIndex = 2;

	// 	it("should display Applicant's and Agent name if agent on case", () => {
	// 		const rows = detailsRows(caseWithAgent, APPEAL_USER_ROLES.APPELLANT);
	// 		expect(rows[nameIndex].condition()).toEqual(true);
	// 		expect(rows[nameIndex].valueText).toEqual('Appellant Test');
	// 		expect(rows[contactIndex].valueText).toEqual('Agent Test');
	// 	});

	// 	it("should display only Applicant's name if no agent on case", () => {
	// 		const rows = detailsRows(caseWithAppellant, APPEAL_USER_ROLES.APPELLANT);
	// 		expect(rows[nameIndex].condition()).toEqual(false);
	// 		expect(rows[contactIndex].valueText).toEqual('Appellant Test');
	// 	});
	// });

	// describe("Other agricultural holding tenants", () => {
	// 	const nameIndex = 1;
	// 	const contactIndex = 2;

	// 	it("should display Applicant's and Agent name if agent on case", () => {
	// 		const rows = detailsRows(caseWithAgent, APPEAL_USER_ROLES.APPELLANT);
	// 		expect(rows[nameIndex].condition()).toEqual(true);
	// 		expect(rows[nameIndex].valueText).toEqual('Appellant Test');
	// 		expect(rows[contactIndex].valueText).toEqual('Agent Test');
	// 	});

	// 	it("should display only Applicant's name if no agent on case", () => {
	// 		const rows = detailsRows(caseWithAppellant, APPEAL_USER_ROLES.APPELLANT);
	// 		expect(rows[nameIndex].condition()).toEqual(false);
	// 		expect(rows[contactIndex].valueText).toEqual('Appellant Test');
	// 	});
	// });

	// describe("Informed other agricultural holding tenants", () => {
	// 	const nameIndex = 1;
	// 	const contactIndex = 2;

	// 	it("should display Applicant's and Agent name if agent on case", () => {
	// 		const rows = detailsRows(caseWithAgent, APPEAL_USER_ROLES.APPELLANT);
	// 		expect(rows[nameIndex].condition()).toEqual(true);
	// 		expect(rows[nameIndex].valueText).toEqual('Appellant Test');
	// 		expect(rows[contactIndex].valueText).toEqual('Agent Test');
	// 	});

	// 	it("should display only Applicant's name if no agent on case", () => {
	// 		const rows = detailsRows(caseWithAppellant, APPEAL_USER_ROLES.APPELLANT);
	// 		expect(rows[nameIndex].condition()).toEqual(false);
	// 		expect(rows[contactIndex].valueText).toEqual('Appellant Test');
	// 	});
	// });

	// describe("Site health and safety issues", () => {
	// 	const nameIndex = 1;
	// 	const contactIndex = 2;

	// 	it("should display Applicant's and Agent name if agent on case", () => {
	// 		const rows = detailsRows(caseWithAgent, APPEAL_USER_ROLES.APPELLANT);
	// 		expect(rows[nameIndex].condition()).toEqual(true);
	// 		expect(rows[nameIndex].valueText).toEqual('Appellant Test');
	// 		expect(rows[contactIndex].valueText).toEqual('Agent Test');
	// 	});

	// 	it("should display only Applicant's name if no agent on case", () => {
	// 		const rows = detailsRows(caseWithAppellant, APPEAL_USER_ROLES.APPELLANT);
	// 		expect(rows[nameIndex].condition()).toEqual(false);
	// 		expect(rows[contactIndex].valueText).toEqual('Appellant Test');
	// 	});
	// });

	// describe("Application reference", () => {
	// 	const nameIndex = 1;
	// 	const contactIndex = 2;

	// 	it("should display Applicant's and Agent name if agent on case", () => {
	// 		const rows = detailsRows(caseWithAgent, APPEAL_USER_ROLES.APPELLANT);
	// 		expect(rows[nameIndex].condition()).toEqual(true);
	// 		expect(rows[nameIndex].valueText).toEqual('Appellant Test');
	// 		expect(rows[contactIndex].valueText).toEqual('Agent Test');
	// 	});

	// 	it("should display only Applicant's name if no agent on case", () => {
	// 		const rows = detailsRows(caseWithAppellant, APPEAL_USER_ROLES.APPELLANT);
	// 		expect(rows[nameIndex].condition()).toEqual(false);
	// 		expect(rows[contactIndex].valueText).toEqual('Appellant Test');
	// 	});
	// });

	// describe("What date did you submit your planning application", () => {
	// 	const nameIndex = 1;
	// 	const contactIndex = 2;

	// 	it("should display Applicant's and Agent name if agent on case", () => {
	// 		const rows = detailsRows(caseWithAgent, APPEAL_USER_ROLES.APPELLANT);
	// 		expect(rows[nameIndex].condition()).toEqual(true);
	// 		expect(rows[nameIndex].valueText).toEqual('Appellant Test');
	// 		expect(rows[contactIndex].valueText).toEqual('Agent Test');
	// 	});

	// 	it("should display only Applicant's name if no agent on case", () => {
	// 		const rows = detailsRows(caseWithAppellant, APPEAL_USER_ROLES.APPELLANT);
	// 		expect(rows[nameIndex].condition()).toEqual(false);
	// 		expect(rows[contactIndex].valueText).toEqual('Appellant Test');
	// 	});
	// });

	// describe("Enter the description of development", () => {
	// 	const nameIndex = 1;
	// 	const contactIndex = 2;

	// 	it("should display Applicant's and Agent name if agent on case", () => {
	// 		const rows = detailsRows(caseWithAgent, APPEAL_USER_ROLES.APPELLANT);
	// 		expect(rows[nameIndex].condition()).toEqual(true);
	// 		expect(rows[nameIndex].valueText).toEqual('Appellant Test');
	// 		expect(rows[contactIndex].valueText).toEqual('Agent Test');
	// 	});

	// 	it("should display only Applicant's name if no agent on case", () => {
	// 		const rows = detailsRows(caseWithAppellant, APPEAL_USER_ROLES.APPELLANT);
	// 		expect(rows[nameIndex].condition()).toEqual(false);
	// 		expect(rows[contactIndex].valueText).toEqual('Appellant Test');
	// 	});
	// });

	// describe("Did the local planning authority change the description of development?", () => {
	// 	const nameIndex = 1;
	// 	const contactIndex = 2;

	// 	it("should display Applicant's and Agent name if agent on case", () => {
	// 		const rows = detailsRows(caseWithAgent, APPEAL_USER_ROLES.APPELLANT);
	// 		expect(rows[nameIndex].condition()).toEqual(true);
	// 		expect(rows[nameIndex].valueText).toEqual('Appellant Test');
	// 		expect(rows[contactIndex].valueText).toEqual('Agent Test');
	// 	});

	// 	it("should display only Applicant's name if no agent on case", () => {
	// 		const rows = detailsRows(caseWithAppellant, APPEAL_USER_ROLES.APPELLANT);
	// 		expect(rows[nameIndex].condition()).toEqual(false);
	// 		expect(rows[contactIndex].valueText).toEqual('Appellant Test');
	// 	});
	// });

	// describe("Preferred procedure", () => {
	// 	const nameIndex = 1;
	// 	const contactIndex = 2;

	// 	it("should display Applicant's and Agent name if agent on case", () => {
	// 		const rows = detailsRows(caseWithAgent, APPEAL_USER_ROLES.APPELLANT);
	// 		expect(rows[nameIndex].condition()).toEqual(true);
	// 		expect(rows[nameIndex].valueText).toEqual('Appellant Test');
	// 		expect(rows[contactIndex].valueText).toEqual('Agent Test');
	// 	});

	// 	it("should display only Applicant's name if no agent on case", () => {
	// 		const rows = detailsRows(caseWithAppellant, APPEAL_USER_ROLES.APPELLANT);
	// 		expect(rows[nameIndex].condition()).toEqual(false);
	// 		expect(rows[contactIndex].valueText).toEqual('Appellant Test');
	// 	});
	// });

	// describe("Are there other appeals linked to your development", () => {
	// 	const nameIndex = 1;
	// 	const contactIndex = 2;

	// 	it("should display Applicant's and Agent name if agent on case", () => {
	// 		const rows = detailsRows(caseWithAgent, APPEAL_USER_ROLES.APPELLANT);
	// 		expect(rows[nameIndex].condition()).toEqual(true);
	// 		expect(rows[nameIndex].valueText).toEqual('Appellant Test');
	// 		expect(rows[contactIndex].valueText).toEqual('Agent Test');
	// 	});

	// 	it("should display only Applicant's name if no agent on case", () => {
	// 		const rows = detailsRows(caseWithAppellant, APPEAL_USER_ROLES.APPELLANT);
	// 		expect(rows[nameIndex].condition()).toEqual(false);
	// 		expect(rows[contactIndex].valueText).toEqual('Appellant Test');
	// 	});
	// });

	// describe("Cost application", () => {
	// 	const nameIndex = 1;
	// 	const contactIndex = 2;

	// 	it("should display Applicant's and Agent name if agent on case", () => {
	// 		const rows = detailsRows(caseWithAgent, APPEAL_USER_ROLES.APPELLANT);
	// 		expect(rows[nameIndex].condition()).toEqual(true);
	// 		expect(rows[nameIndex].valueText).toEqual('Appellant Test');
	// 		expect(rows[contactIndex].valueText).toEqual('Agent Test');
	// 	});

	// 	it("should display only Applicant's name if no agent on case", () => {
	// 		const rows = detailsRows(caseWithAppellant, APPEAL_USER_ROLES.APPELLANT);
	// 		expect(rows[nameIndex].condition()).toEqual(false);
	// 		expect(rows[contactIndex].valueText).toEqual('Appellant Test');
	// 	});
	// });
});
