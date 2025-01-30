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
			expect(rows[phoneIndex].keyText).toEqual('Phone number');
			expect(rows[phoneIndex].valueText).toEqual('12345');
		});

		it("should display agent's phone number if agent on case", () => {
			const rows = detailsRows(caseWithAgent, APPEAL_USER_ROLES.APPELLANT);
			expect(rows[phoneIndex].keyText).toEqual('Phone number');
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
			expect(rows[siteAddressIndex].keyText).toEqual('Site address');
		});
	});

	describe('What is the area of the appeal site', () => {
		const siteAreaIndex = 5;

		it('should display appeal site area if not null', () => {
			const testCase = structuredClone(caseWithAppellant);
			testCase.siteAreaSquareMetres = 1.5;
			const rows = detailsRows(testCase, APPEAL_USER_ROLES.APPELLANT);

			expect(rows[siteAreaIndex].condition(testCase)).toEqual(true);
			expect(rows[siteAreaIndex].keyText).toEqual('What is the area of the appeal site?');
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
			expect(rows[greenBeltIndex].keyText).toEqual('Is the site in a green belt');
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
			expect(rows[fullyOwnedIndex].keyText).toEqual('Site fully owned');
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
			expect(rows[partlyOwnedIndex].keyText).toEqual('Site partly owned');
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
			expect(rows[otherOwnersIndex].keyText).toEqual('Other owners known');
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
			expect(rows[otherOwnersIdentifiedIndex].keyText).toEqual('Other owners identified');
			expect(rows[otherOwnersIdentifiedIndex].valueText).toEqual('Yes');
			expect(rows[advertisedAppealIndex].condition(testCase)).toEqual(true);
			expect(rows[advertisedAppealIndex].keyText).toEqual('Advertised appeal');
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
			expect(rows[otherOwnersInformedIndex].keyText).toEqual('Other owners informed');
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
			expect(rows[inspectorAccessIndex].keyText).toEqual(
				'Will an inspector need to access the land or property?'
			);
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

	describe('Agricultural holding', () => {
		const agriculturalHoldingIndex = 14;

		it('should show Agricultural Holding if not null', () => {
			const testCase = structuredClone(caseWithAppellant);

			testCase.agriculturalHolding = true;

			const rows = detailsRows(testCase, APPEAL_USER_ROLES.APPELLANT);
			expect(rows[agriculturalHoldingIndex].condition(testCase)).toEqual(true);
			expect(rows[agriculturalHoldingIndex].keyText).toEqual('Agricultural holding');
			expect(rows[agriculturalHoldingIndex].valueText).toEqual('Yes');

			testCase.agriculturalHolding = false;
			const rows2 = detailsRows(testCase, APPEAL_USER_ROLES.APPELLANT);
			expect(rows2[agriculturalHoldingIndex].condition(testCase)).toEqual(true);
			expect(rows2[agriculturalHoldingIndex].valueText).toEqual('No');
		});

		it('should not show Agricultural Holding if null', () => {
			const testCase = structuredClone(caseWithAppellant);

			const rows = detailsRows(testCase, APPEAL_USER_ROLES.APPELLANT);

			expect(rows[agriculturalHoldingIndex].condition(testCase)).toEqual(false);
			expect(rows[agriculturalHoldingIndex].valueText).toEqual('');
		});
	});

	describe('Tenant on agricultural holding', () => {
		const tenantAgriculturalIndex = 15;

		it('should display tenant on agricultural holding if true', () => {
			const testCase = structuredClone(caseWithAppellant);
			testCase.tenantAgriculturalHolding = true;
			const rows = detailsRows(testCase, APPEAL_USER_ROLES.APPELLANT);
			expect(rows[tenantAgriculturalIndex].condition(testCase)).toEqual(true);
			expect(rows[tenantAgriculturalIndex].keyText).toEqual('Tenant on agricultural holding');
			expect(rows[tenantAgriculturalIndex].valueText).toEqual('Yes');
		});

		it('should not display tenant on agricultural holding if not true', () => {
			const testCase = structuredClone(caseWithAppellant);

			const rows = detailsRows(testCase, APPEAL_USER_ROLES.APPELLANT);
			expect(rows[tenantAgriculturalIndex].condition(testCase)).toBeFalsy();

			testCase.tenantAgriculturalHolding = false;
			const rows2 = detailsRows(testCase, APPEAL_USER_ROLES.APPELLANT);
			expect(rows2[tenantAgriculturalIndex].condition(testCase)).toEqual(false);
		});
	});

	describe('Other agricultural holding tenants', () => {
		const otherAgriculturalTenantsIndex = 16;

		it('should display Other agricultural holding tenants if true', () => {
			const testCase = structuredClone(caseWithAppellant);
			testCase.otherTenantsAgriculturalHolding = true;
			const rows = detailsRows(testCase, APPEAL_USER_ROLES.APPELLANT);
			expect(rows[otherAgriculturalTenantsIndex].condition(testCase)).toEqual(true);
			expect(rows[otherAgriculturalTenantsIndex].keyText).toEqual(
				'Other agricultural holding tenants'
			);
			expect(rows[otherAgriculturalTenantsIndex].valueText).toEqual('Yes');
		});

		it('should not display Other agricultural holding tenants if not true', () => {
			const testCase = structuredClone(caseWithAppellant);

			const rows = detailsRows(testCase, APPEAL_USER_ROLES.APPELLANT);
			expect(rows[otherAgriculturalTenantsIndex].condition(testCase)).toBeFalsy();

			testCase.otherTenantsAgriculturalHolding = false;
			const rows2 = detailsRows(testCase, APPEAL_USER_ROLES.APPELLANT);
			expect(rows2[otherAgriculturalTenantsIndex].condition(testCase)).toEqual(false);
		});
	});

	describe('Informed other agricultural holding tenants', () => {
		const informedAgriculturalTenantsIndex = 17;

		it('should display informed other agricultural holding tenants if true', () => {
			const testCase = structuredClone(caseWithAppellant);
			testCase.informedTenantsAgriculturalHolding = true;
			const rows = detailsRows(testCase, APPEAL_USER_ROLES.APPELLANT);
			expect(rows[informedAgriculturalTenantsIndex].condition(testCase)).toEqual(true);
			expect(rows[informedAgriculturalTenantsIndex].keyText).toEqual(
				'Informed other agricultural holding tenants'
			);
			expect(rows[informedAgriculturalTenantsIndex].valueText).toEqual('Yes');
		});

		it('should not display informed other agricultural holding tenants if not true', () => {
			const testCase = structuredClone(caseWithAppellant);

			const rows = detailsRows(testCase, APPEAL_USER_ROLES.APPELLANT);
			expect(rows[informedAgriculturalTenantsIndex].condition(testCase)).toBeFalsy();

			testCase.informedTenantsAgriculturalHolding = false;
			const rows2 = detailsRows(testCase, APPEAL_USER_ROLES.APPELLANT);
			expect(rows2[informedAgriculturalTenantsIndex].condition(testCase)).toEqual(false);
		});
	});

	describe('Application reference', () => {
		const applicationReferenceIndex = 19;

		it('should display the application reference if set', () => {
			const testCase = structuredClone(caseWithAppellant);
			testCase.applicationReference = '12345';
			const rows = detailsRows(testCase, APPEAL_USER_ROLES.APPELLANT);
			expect(rows[applicationReferenceIndex].condition(testCase)).toBeTruthy();
			expect(rows[applicationReferenceIndex].keyText).toEqual('Application reference');
			expect(rows[applicationReferenceIndex].valueText).toEqual('12345');
		});

		it('should not display the application reference if not set', () => {
			const testCase = structuredClone(caseWithAppellant);

			const rows = detailsRows(testCase, APPEAL_USER_ROLES.APPELLANT);
			expect(rows[applicationReferenceIndex].condition(testCase)).toBeFalsy();
		});
	});

	describe('Enter the description of development', () => {
		const descriptionIndex = 21;

		it('should display the development description if set', () => {
			const testCase = structuredClone(caseWithAppellant);
			testCase.originalDevelopmentDescription = 'A test site';
			const rows = detailsRows(testCase, APPEAL_USER_ROLES.APPELLANT);
			expect(rows[descriptionIndex].condition(testCase)).toBeTruthy();
			expect(rows[descriptionIndex].keyText).toEqual('Enter the description of development');
			expect(rows[descriptionIndex].valueText).toEqual('A test site');
		});

		it('should not display the development description if not set', () => {
			const testCase = structuredClone(caseWithAppellant);

			const rows = detailsRows(testCase, APPEAL_USER_ROLES.APPELLANT);
			expect(rows[descriptionIndex].condition(testCase)).toBeFalsy();
			expect(rows[descriptionIndex].valueText).toEqual('');
		});
	});

	describe('Did the local planning authority change the description of development?', () => {
		const lpaChangedDescriptionIndex = 22;

		it('should show Green Belt if not null', () => {
			const testCase = structuredClone(caseWithAppellant);

			testCase.changedDevelopmentDescription = true;

			const rows = detailsRows(testCase, APPEAL_USER_ROLES.APPELLANT);
			expect(rows[lpaChangedDescriptionIndex].condition(testCase)).toEqual(true);
			expect(rows[lpaChangedDescriptionIndex].keyText).toEqual(
				'Did the local planning authority change the description of development?'
			);
			expect(rows[lpaChangedDescriptionIndex].valueText).toEqual('Yes');

			testCase.changedDevelopmentDescription = false;
			const rows2 = detailsRows(testCase, APPEAL_USER_ROLES.APPELLANT);
			expect(rows2[lpaChangedDescriptionIndex].condition(testCase)).toEqual(true);
			expect(rows2[lpaChangedDescriptionIndex].valueText).toEqual('No');
		});

		it('should not show Green Belt if null', () => {
			const testCase = structuredClone(caseWithAppellant);

			const rows = detailsRows(testCase, APPEAL_USER_ROLES.APPELLANT);

			expect(rows[lpaChangedDescriptionIndex].condition(testCase)).toEqual(false);
		});
	});

	describe('Preferred procedure', () => {
		const procedureIndex = 23;

		it('should display the appellant preferred procedure if set', () => {
			const testCase = structuredClone(caseWithAppellant);
			testCase.appellantProcedurePreference = 'Inquiry';
			testCase.appellantProcedurePreferenceDetails = 'For reasons';

			const rows = detailsRows(testCase, APPEAL_USER_ROLES.APPELLANT);
			expect(rows[procedureIndex].condition(testCase)).toBeTruthy();
			expect(rows[procedureIndex].keyText).toEqual('Preferred procedure');
			expect(rows[procedureIndex].valueText).toEqual('Inquiry\nFor reasons');
		});

		it('should not display the procedure preference if not set', () => {
			const testCase = structuredClone(caseWithAppellant);

			const rows = detailsRows(testCase, APPEAL_USER_ROLES.APPELLANT);
			expect(rows[procedureIndex].condition(testCase)).toBeFalsy();
		});
	});

	describe('Cost application', () => {
		const costsApplicationIndex = 25;

		it('should display Yes if applicant applied for costs', () => {
			const testCase = structuredClone(caseWithAppellant);
			testCase.appellantCostsAppliedFor = true;
			const rows = detailsRows(testCase, APPEAL_USER_ROLES.APPELLANT);
			expect(rows[costsApplicationIndex].keyText).toEqual(
				'Do you need to apply for an award of appeal costs?'
			);
			expect(rows[costsApplicationIndex].valueText).toEqual('Yes');

			const rows2 = detailsRows(testCase, LPA_USER_ROLE);
			expect(rows2[costsApplicationIndex].keyText).toEqual(
				'Did the appellant apply for an award of appeal costs?'
			);
			expect(rows2[costsApplicationIndex].valueText).toEqual('Yes');
		});

		it('should display no if Applicant did not apply for costs', () => {
			const testCase = structuredClone(caseWithAppellant);

			const rows = detailsRows(testCase, APPEAL_USER_ROLES.APPELLANT);
			expect(rows[costsApplicationIndex].valueText).toEqual('No');

			testCase.appellantCostsAppliedFor = false;
			const rows2 = detailsRows(testCase, APPEAL_USER_ROLES.APPELLANT);
			expect(rows2[costsApplicationIndex].valueText).toEqual('No');
		});
	});
});
