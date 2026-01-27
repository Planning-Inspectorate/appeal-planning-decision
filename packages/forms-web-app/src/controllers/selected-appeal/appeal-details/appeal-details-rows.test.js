const { APPEAL_DEVELOPMENT_TYPE } = require('@planning-inspectorate/data-model');
const { detailsRows } = require('./appeal-details-rows');
const { APPEAL_USER_ROLES, LPA_USER_ROLE } = require('@pins/common/src/constants');
const { CASE_TYPES } = require('@pins/common/src/database/data-static');

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

		it('should display grid reference if no address', () => {
			const siteAddressIndex = 4;
			let testCase = structuredClone(caseWithAppellant);
			testCase.siteGridReferenceEasting = '123456';
			testCase.siteGridReferenceNorthing = '654321';
			const rows = detailsRows(testCase, APPEAL_USER_ROLES.APPELLANT);

			expect(rows[siteAddressIndex].condition(testCase)).toBeTruthy();
			expect(rows[siteAddressIndex].valueText).toEqual('Eastings: 123456\nNorthings: 654321');
			expect(rows[siteAddressIndex].keyText).toEqual('Site address');
		});
		it('should display site address if grid reference and site address', () => {
			const siteAddressIndex = 4;
			let testCase = structuredClone(caseWithAppellant);
			testCase.siteAddressLine1 = 'Test address';
			testCase.siteAddressTown = 'Testville';
			testCase.siteAddressPostcode = 'TS1 1TT';
			testCase.siteGridReferenceEasting = '123456';
			testCase.siteGridReferenceNorthing = '654321';
			const rows = detailsRows(testCase, APPEAL_USER_ROLES.APPELLANT);

			expect(rows[siteAddressIndex].condition(testCase)).toBeTruthy();
			expect(rows[siteAddressIndex].valueText).toEqual('Test address\nTestville\nTS1 1TT');
			expect(rows[siteAddressIndex].keyText).toEqual('Site address');
		});
	});

	describe('Is the appeal site on highway land', () => {
		const highwayLandIndex = 5;

		it('should show highway land if not null', () => {
			const testCase = structuredClone(caseWithAppellant);

			testCase.AdvertDetails = [
				{
					isSiteOnHighwayLand: true
				}
			];

			const rows = detailsRows(testCase, APPEAL_USER_ROLES.APPELLANT);
			expect(rows[highwayLandIndex].condition(testCase)).toEqual(true);
			expect(rows[highwayLandIndex].keyText).toEqual('Is the appeal site on highway land?');
			expect(rows[highwayLandIndex].valueText).toEqual('Yes');

			testCase.AdvertDetails = [
				{
					isSiteOnHighwayLand: false
				}
			];
			const rows2 = detailsRows(testCase, APPEAL_USER_ROLES.APPELLANT);
			expect(rows2[highwayLandIndex].condition(testCase)).toEqual(true);
			expect(rows2[highwayLandIndex].valueText).toEqual('No');
		});

		it('should not show highway land if null', () => {
			const testCase = structuredClone(caseWithAppellant);

			const rows = detailsRows(testCase, APPEAL_USER_ROLES.APPELLANT);

			expect(rows[highwayLandIndex].condition(testCase)).toEqual(false);
			expect(rows[highwayLandIndex].valueText).toEqual('');
		});
	});

	describe('advertisement in position', () => {
		const advertInPositionIndex = 6;

		it('should show advertisement in position if not null', () => {
			const testCase = structuredClone(caseWithAppellant);

			testCase.AdvertDetails = [
				{
					isAdvertInPosition: true
				}
			];

			const rows = detailsRows(testCase, APPEAL_USER_ROLES.APPELLANT);
			expect(rows[advertInPositionIndex].condition(testCase)).toEqual(true);
			expect(rows[advertInPositionIndex].keyText).toEqual('Is the advertisement in position?');
			expect(rows[advertInPositionIndex].valueText).toEqual('Yes');

			testCase.AdvertDetails = [
				{
					isAdvertInPosition: false
				}
			];
			const rows2 = detailsRows(testCase, APPEAL_USER_ROLES.APPELLANT);
			expect(rows2[advertInPositionIndex].condition(testCase)).toEqual(true);
			expect(rows2[advertInPositionIndex].valueText).toEqual('No');
		});

		it('should not show advertisement in position if null', () => {
			const testCase = structuredClone(caseWithAppellant);

			const rows = detailsRows(testCase, APPEAL_USER_ROLES.APPELLANT);

			expect(rows[advertInPositionIndex].condition(testCase)).toEqual(false);
			expect(rows[advertInPositionIndex].valueText).toEqual('');
		});
	});

	describe('What is the area of the appeal site', () => {
		const siteAreaIndex = 7;

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
		const greenBeltIndex = 8;

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
		const fullyOwnedIndex = 9;

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
		const partlyOwnedIndex = 10;

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

	describe('All owners known', () => {
		const allOwnersIndex = 11;

		it('should show All Owners Known if not null', () => {
			const testCase = structuredClone(caseWithAppellant);

			testCase.knowsAllOwners = 'Yes';

			const rows = detailsRows(testCase, APPEAL_USER_ROLES.APPELLANT);
			expect(rows[allOwnersIndex].condition(testCase)).toEqual(true);
			expect(rows[allOwnersIndex].keyText).toEqual('All owners known');
			expect(rows[allOwnersIndex].valueText).toEqual('Yes');

			testCase.knowsAllOwners = 'No';
			const rows2 = detailsRows(testCase, APPEAL_USER_ROLES.APPELLANT);
			expect(rows2[allOwnersIndex].condition(testCase)).toEqual(true);
			expect(rows2[allOwnersIndex].valueText).toEqual('No');

			testCase.knowsAllOwners = 'Some';
			const rows3 = detailsRows(testCase, APPEAL_USER_ROLES.APPELLANT);
			expect(rows3[allOwnersIndex].condition(testCase)).toEqual(true);
			expect(rows3[allOwnersIndex].valueText).toEqual('Some');
		});

		it('should not show All Owners Known if null', () => {
			const testCase = structuredClone(caseWithAppellant);

			const rows = detailsRows(testCase, APPEAL_USER_ROLES.APPELLANT);

			expect(rows[allOwnersIndex].condition(testCase)).toEqual(false);
			expect(rows[allOwnersIndex].valueText).toEqual('');
		});
	});

	describe('Other owners known', () => {
		const otherOwnersIndex = 12;

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
		const otherOwnersIdentifiedIndex = 13;
		const advertisedAppealIndex = 14;

		it('should display Other Owners Identified and Advertised Appeal if advertised appeal not null', () => {
			const testCase = structuredClone(caseWithAppellant);
			testCase.advertisedAppeal = true;
			const rows = detailsRows(testCase, APPEAL_USER_ROLES.APPELLANT);
			expect(rows[otherOwnersIdentifiedIndex].condition(testCase)).toEqual(true);
			expect(rows[otherOwnersIdentifiedIndex].keyText).toEqual('Other owners identified');
			expect(rows[otherOwnersIdentifiedIndex].valueText).toEqual('Yes');
			expect(rows[advertisedAppealIndex].condition(testCase)).toEqual(true);
			expect(rows[advertisedAppealIndex].keyText).toEqual('Advertised appeal');
			expect(rows[advertisedAppealIndex].valueText).toEqual('Yes');

			testCase.advertisedAppeal = false;
			const rows2 = detailsRows(testCase, APPEAL_USER_ROLES.APPELLANT);
			expect(rows2[otherOwnersIdentifiedIndex].condition(testCase)).toEqual(true);
			expect(rows2[otherOwnersIdentifiedIndex].keyText).toEqual('Other owners identified');
			expect(rows2[otherOwnersIdentifiedIndex].valueText).toEqual('No');
			expect(rows2[advertisedAppealIndex].condition(testCase)).toEqual(true);
			expect(rows2[advertisedAppealIndex].keyText).toEqual('Advertised appeal');
			expect(rows2[advertisedAppealIndex].valueText).toEqual('No');
		});

		it('should not display Other Owners Identified and Advertised Appeal if advertised appeal null', () => {
			const testCase = structuredClone(caseWithAppellant);

			const rows = detailsRows(testCase, APPEAL_USER_ROLES.APPELLANT);
			expect(rows[otherOwnersIdentifiedIndex].condition(testCase)).toEqual(false);
			expect(rows[advertisedAppealIndex].condition(testCase)).toEqual(false);
		});
	});

	describe('Other owners informed', () => {
		const otherOwnersInformedIndex = 15;

		it('should display other owners informed if otherOwnersInformed not null', () => {
			const testCase = structuredClone(caseWithAppellant);
			testCase.ownersInformed = true;
			const rows = detailsRows(testCase, APPEAL_USER_ROLES.APPELLANT);
			expect(rows[otherOwnersInformedIndex].condition(testCase)).toEqual(true);
			expect(rows[otherOwnersInformedIndex].keyText).toEqual('Other owners informed');
			expect(rows[otherOwnersInformedIndex].valueText).toEqual('Yes');

			testCase.ownersInformed = false;
			const rows2 = detailsRows(testCase, APPEAL_USER_ROLES.APPELLANT);
			expect(rows2[otherOwnersInformedIndex].condition(testCase)).toEqual(true);
			expect(rows2[otherOwnersInformedIndex].keyText).toEqual('Other owners informed');
			expect(rows2[otherOwnersInformedIndex].valueText).toEqual('No');
		});

		it('should display other owners informed if otherOwnersInformed null', () => {
			const testCase = structuredClone(caseWithAppellant);

			const rows = detailsRows(testCase, APPEAL_USER_ROLES.APPELLANT);
			expect(rows[otherOwnersInformedIndex].condition(testCase)).toEqual(false);
		});
	});

	describe(`Do you have the land owner's permission?`, () => {
		const landOwnersPermissionIndex = 16;

		it('should display Inspector access details if provided by applicant', () => {
			const testCase = structuredClone(caseWithAppellant);
			testCase.hasLandownersPermission = true;
			const rows = detailsRows(testCase, APPEAL_USER_ROLES.APPELLANT);
			expect(rows[landOwnersPermissionIndex].keyText).toEqual(
				`Do you have the land owner's permission?`
			);
			expect(rows[landOwnersPermissionIndex].valueText).toEqual('Yes');
			expect(rows[landOwnersPermissionIndex].condition(testCase)).toBe(true);
		});

		it(`should not show if land owner's permission not answered`, () => {
			const testCase = structuredClone(caseWithAppellant);

			const rows = detailsRows(testCase, APPEAL_USER_ROLES.APPELLANT);
			expect(rows[landOwnersPermissionIndex].valueText).toEqual('');
			expect(rows[landOwnersPermissionIndex].condition(testCase)).toBe(false);
		});
	});

	describe('Will an inspector need to access the land or property?', () => {
		const inspectorAccessIndex = 17;

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
		const agriculturalHoldingIndex = 18;

		it('should show Agricultural Holding if not null', () => {
			const testCase = structuredClone(caseWithAppellant);

			testCase.appealTypeCode = CASE_TYPES.S78.processCode;
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
			testCase.appealTypeCode = CASE_TYPES.S78.processCode;

			const rows = detailsRows(testCase, APPEAL_USER_ROLES.APPELLANT);

			expect(rows[agriculturalHoldingIndex].condition(testCase)).toEqual(false);
			expect(rows[agriculturalHoldingIndex].valueText).toEqual('');
		});
	});

	describe('Tenant on agricultural holding', () => {
		const tenantAgriculturalIndex = 19;

		it('should display tenant on agricultural holding if not null', () => {
			const testCase = structuredClone(caseWithAppellant);
			testCase.appealTypeCode = CASE_TYPES.S78.processCode;
			testCase.tenantAgriculturalHolding = true;
			const rows = detailsRows(testCase, APPEAL_USER_ROLES.APPELLANT);
			expect(rows[tenantAgriculturalIndex].condition(testCase)).toEqual(true);
			expect(rows[tenantAgriculturalIndex].keyText).toEqual('Tenant on agricultural holding');
			expect(rows[tenantAgriculturalIndex].valueText).toEqual('Yes');

			testCase.tenantAgriculturalHolding = false;
			const rows2 = detailsRows(testCase, APPEAL_USER_ROLES.APPELLANT);
			expect(rows2[tenantAgriculturalIndex].condition(testCase)).toEqual(true);
			expect(rows2[tenantAgriculturalIndex].keyText).toEqual('Tenant on agricultural holding');
			expect(rows2[tenantAgriculturalIndex].valueText).toEqual('No');
		});

		it('should not display tenant on agricultural holding if null', () => {
			const testCase = structuredClone(caseWithAppellant);
			testCase.appealTypeCode = CASE_TYPES.S78.processCode;

			const rows = detailsRows(testCase, APPEAL_USER_ROLES.APPELLANT);
			expect(rows[tenantAgriculturalIndex].condition(testCase)).toEqual(false);
		});
	});

	describe('Other agricultural holding tenants', () => {
		const otherAgriculturalTenantsIndex = 20;

		it('should display Other agricultural holding tenants if not null', () => {
			const testCase = structuredClone(caseWithAppellant);
			testCase.appealTypeCode = CASE_TYPES.S78.processCode;
			testCase.otherTenantsAgriculturalHolding = true;
			const rows = detailsRows(testCase, APPEAL_USER_ROLES.APPELLANT);
			expect(rows[otherAgriculturalTenantsIndex].condition(testCase)).toEqual(true);
			expect(rows[otherAgriculturalTenantsIndex].keyText).toEqual(
				'Other agricultural holding tenants'
			);
			expect(rows[otherAgriculturalTenantsIndex].valueText).toEqual('Yes');

			testCase.otherTenantsAgriculturalHolding = false;
			const rows2 = detailsRows(testCase, APPEAL_USER_ROLES.APPELLANT);
			expect(rows2[otherAgriculturalTenantsIndex].condition(testCase)).toEqual(true);
			expect(rows2[otherAgriculturalTenantsIndex].keyText).toEqual(
				'Other agricultural holding tenants'
			);
			expect(rows2[otherAgriculturalTenantsIndex].valueText).toEqual('No');
		});

		it('should not display Other agricultural holding tenants if null', () => {
			const testCase = structuredClone(caseWithAppellant);
			testCase.appealTypeCode = CASE_TYPES.S78.processCode;

			const rows = detailsRows(testCase, APPEAL_USER_ROLES.APPELLANT);
			expect(rows[otherAgriculturalTenantsIndex].condition(testCase)).toEqual(false);
		});
	});

	describe('Informed other agricultural holding tenants', () => {
		const informedAgriculturalTenantsIndex = 21;

		it('should display informed other agricultural holding tenants if not null', () => {
			const testCase = structuredClone(caseWithAppellant);
			testCase.appealTypeCode = CASE_TYPES.S78.processCode;
			testCase.informedTenantsAgriculturalHolding = true;
			const rows = detailsRows(testCase, APPEAL_USER_ROLES.APPELLANT);
			expect(rows[informedAgriculturalTenantsIndex].condition(testCase)).toEqual(true);
			expect(rows[informedAgriculturalTenantsIndex].keyText).toEqual(
				'Informed other agricultural holding tenants'
			);
			expect(rows[informedAgriculturalTenantsIndex].valueText).toEqual('Yes');

			testCase.informedTenantsAgriculturalHolding = false;
			const rows2 = detailsRows(testCase, APPEAL_USER_ROLES.APPELLANT);
			expect(rows2[informedAgriculturalTenantsIndex].condition(testCase)).toEqual(true);
			expect(rows2[informedAgriculturalTenantsIndex].keyText).toEqual(
				'Informed other agricultural holding tenants'
			);
			expect(rows2[informedAgriculturalTenantsIndex].valueText).toEqual('No');
		});

		it('should not display informed other agricultural holding tenants if null', () => {
			const testCase = structuredClone(caseWithAppellant);
			testCase.appealTypeCode = CASE_TYPES.S78.processCode;

			const rows = detailsRows(testCase, APPEAL_USER_ROLES.APPELLANT);
			expect(rows[informedAgriculturalTenantsIndex].condition(testCase)).toEqual(false);
		});
	});

	describe('Application reference', () => {
		const applicationReferenceIndex = 23;

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

	describe('siteUseAtTimeOfApplication', () => {
		const applicationReferenceIndex = 24;

		it('should display the siteUseAtTimeOfApplication if set', () => {
			const testCase = structuredClone(caseWithAppellant);
			testCase.siteUseAtTimeOfApplication = 'testing';
			const rows = detailsRows(testCase, APPEAL_USER_ROLES.APPELLANT);
			expect(rows[applicationReferenceIndex].condition(testCase)).toBeTruthy();
			expect(rows[applicationReferenceIndex].keyText).toEqual(
				'What did you use the appeal site for when you made the application?'
			);
			expect(rows[applicationReferenceIndex].valueText).toEqual('testing');
		});

		it('should not display the siteUseAtTimeOfApplication if not set', () => {
			const testCase = structuredClone(caseWithAppellant);

			const rows = detailsRows(testCase, APPEAL_USER_ROLES.APPELLANT);
			expect(rows[applicationReferenceIndex].condition(testCase)).toBeFalsy();
		});
	});

	describe('applicationMadeUnderActSection', () => {
		const applicationReferenceIndex = 25;

		it('should display the applicationMadeUnderActSection if set', () => {
			const testCase = structuredClone(caseWithAppellant);
			testCase.applicationMadeUnderActSection = 'existing-development';
			const rows = detailsRows(testCase, APPEAL_USER_ROLES.APPELLANT);
			expect(rows[applicationReferenceIndex].condition(testCase)).toBeTruthy();
			expect(rows[applicationReferenceIndex].keyText).toEqual(
				'Was your application for the existing or proposed use of a development?'
			);
			expect(rows[applicationReferenceIndex].valueText).toEqual('Existing development');
		});

		it('should not display the applicationMadeUnderActSection if not set', () => {
			const testCase = structuredClone(caseWithAppellant);
			const rows = detailsRows(testCase, APPEAL_USER_ROLES.APPELLANT);
			expect(rows[applicationReferenceIndex].condition(testCase)).toBeFalsy();
		});

		it('should return database value if unknown value', () => {
			const testCase = structuredClone(caseWithAppellant);
			testCase.applicationMadeUnderActSection = 'something-new';
			const rows = detailsRows(testCase, APPEAL_USER_ROLES.APPELLANT);
			expect(rows[applicationReferenceIndex].condition(testCase)).toBeTruthy();
			expect(rows[applicationReferenceIndex].keyText).toEqual(
				'Was your application for the existing or proposed use of a development?'
			);
			expect(rows[applicationReferenceIndex].valueText).toEqual('something-new');
		});
	});

	describe('Was your application for a major or minor development?', () => {
		const majorMinorIndex = 26;

		const testCases = [
			{ developmentType: APPEAL_DEVELOPMENT_TYPE.HOUSEHOLDER, expected: '' },
			{ developmentType: APPEAL_DEVELOPMENT_TYPE.CHANGE_OF_USE, expected: '' },
			{ developmentType: APPEAL_DEVELOPMENT_TYPE.MINERAL_WORKINGS, expected: '' },
			{ developmentType: APPEAL_DEVELOPMENT_TYPE.MAJOR_DWELLINGS, expected: 'Major' },
			{ developmentType: APPEAL_DEVELOPMENT_TYPE.MAJOR_INDUSTRY_STORAGE, expected: 'Major' },
			{ developmentType: APPEAL_DEVELOPMENT_TYPE.MAJOR_OFFICES, expected: 'Major' },
			{ developmentType: APPEAL_DEVELOPMENT_TYPE.MAJOR_RETAIL_SERVICES, expected: 'Major' },
			{ developmentType: APPEAL_DEVELOPMENT_TYPE.MAJOR_TRAVELLER_CARAVAN, expected: 'Major' },
			{ developmentType: APPEAL_DEVELOPMENT_TYPE.OTHER_MAJOR, expected: 'Major' },
			{ developmentType: APPEAL_DEVELOPMENT_TYPE.MINOR_DWELLINGS, expected: 'Minor' },
			{ developmentType: APPEAL_DEVELOPMENT_TYPE.MINOR_INDUSTRY_STORAGE, expected: 'Minor' },
			{ developmentType: APPEAL_DEVELOPMENT_TYPE.MINOR_OFFICES, expected: 'Minor' },
			{ developmentType: APPEAL_DEVELOPMENT_TYPE.MINOR_RETAIL_SERVICES, expected: 'Minor' },
			{ developmentType: APPEAL_DEVELOPMENT_TYPE.MINOR_TRAVELLER_CARAVAN, expected: 'Minor' },
			{ developmentType: APPEAL_DEVELOPMENT_TYPE.OTHER_MINOR, expected: 'Minor' }
		];

		it.each(testCases)(
			'should show correct value for $developmentType',
			({ developmentType, expected }) => {
				const testCase = structuredClone(caseWithAppellant);
				testCase.appealTypeCode = CASE_TYPES.S78.processCode;
				testCase.developmentType = developmentType;

				const rows = detailsRows(testCase, APPEAL_USER_ROLES.APPELLANT);

				expect(rows[majorMinorIndex].keyText).toEqual(
					'Was your application for a major or minor development?'
				);
				expect(rows[majorMinorIndex].valueText).toEqual(expected);
				expect(rows[majorMinorIndex].condition(testCase)).toEqual(expected !== '');
			}
		);

		it('should not display if developmentType is not set', () => {
			const testCase = structuredClone(caseWithAppellant);

			const rows = detailsRows(testCase, APPEAL_USER_ROLES.APPELLANT);
			expect(rows[majorMinorIndex].condition(testCase)).toBeFalsy();
		});
	});

	describe('Was your application about any of the following?', () => {
		const developmentTypeIndex = 27;

		it('should display the development type if appeal type code is not HAS', () => {
			const testCase = structuredClone(caseWithAppellant);
			testCase.developmentType = APPEAL_DEVELOPMENT_TYPE.HOUSEHOLDER;
			testCase.appealTypeCode = 'S78';

			const rows = detailsRows(testCase, APPEAL_USER_ROLES.APPELLANT);
			expect(rows[developmentTypeIndex].condition(testCase)).toEqual(true);
			expect(rows[developmentTypeIndex].keyText).toEqual(
				'Was your application about any of the following?'
			);
			expect(rows[developmentTypeIndex].valueText).toEqual('Householder development');
		});

		it('should not display development type if appeal type code is HAS', () => {
			const testCase = structuredClone(caseWithAppellant);
			testCase.appealTypeCode = CASE_TYPES.HAS.processCode;

			const rows = detailsRows(testCase, APPEAL_USER_ROLES.APPELLANT);
			expect(rows[developmentTypeIndex].condition(testCase)).toEqual(false);
		});
	});

	describe('Enter the description of development', () => {
		const descriptionIndex = 28;

		it('should display the development description if set', () => {
			const testCase = structuredClone(caseWithAppellant);
			testCase.originalDevelopmentDescription = 'A test site';
			const rows = detailsRows(testCase, APPEAL_USER_ROLES.APPELLANT);
			expect(rows[descriptionIndex].condition(testCase)).toBeTruthy();
			expect(rows[descriptionIndex].keyText).toEqual('Enter the description of development');
			expect(rows[descriptionIndex].valueText).toEqual('A test site');
		});

		it('should show advert text if advert appeal type', () => {
			const testCase = structuredClone(caseWithAppellant);

			testCase.originalDevelopmentDescription = 'A test site';
			testCase.appealTypeCode = 'CAS_ADVERTS';

			const rows = detailsRows(testCase, APPEAL_USER_ROLES.APPELLANT);
			expect(rows[descriptionIndex].keyText).toEqual(
				'Enter the description of the advertisement that you submitted in your application'
			);

			testCase.appealTypeCode = 'ADVERTS';
			const rows2 = detailsRows(testCase, APPEAL_USER_ROLES.APPELLANT);
			expect(rows2[descriptionIndex].keyText).toEqual(
				'Enter the description of the advertisement that you submitted in your application'
			);
		});

		it('should not display the development description if not set', () => {
			const testCase = structuredClone(caseWithAppellant);

			const rows = detailsRows(testCase, APPEAL_USER_ROLES.APPELLANT);
			expect(rows[descriptionIndex].condition(testCase)).toBeFalsy();
			expect(rows[descriptionIndex].valueText).toEqual('');
		});
	});

	describe('Did the local planning authority change the description of development?', () => {
		const lpaChangedDescriptionIndex = 29;

		it('should show change the description if not null', () => {
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

		it('should show advert text if advert appeal type', () => {
			const testCase = structuredClone(caseWithAppellant);

			testCase.changedDevelopmentDescription = true;
			testCase.appealTypeCode = 'CAS_ADVERTS';

			const rows = detailsRows(testCase, APPEAL_USER_ROLES.APPELLANT);
			expect(rows[lpaChangedDescriptionIndex].keyText).toEqual(
				'Did the local planning authority change the description of the advertisement?'
			);

			testCase.appealTypeCode = 'ADVERTS';
			const rows2 = detailsRows(testCase, APPEAL_USER_ROLES.APPELLANT);
			expect(rows2[lpaChangedDescriptionIndex].keyText).toEqual(
				'Did the local planning authority change the description of the advertisement?'
			);
		});

		it('should not show change the description if null', () => {
			const testCase = structuredClone(caseWithAppellant);

			const rows = detailsRows(testCase, APPEAL_USER_ROLES.APPELLANT);

			expect(rows[lpaChangedDescriptionIndex].condition(testCase)).toEqual(false);
		});
	});

	describe('Preferred procedure', () => {
		const lpaChangedDescriptionIndex = 30;

		it('should display the appellant preferred procedure if set', () => {
			const testCase = structuredClone(caseWithAppellant);
			testCase.appellantProcedurePreference = 'Inquiry';
			testCase.appellantProcedurePreferenceDetails = 'For reasons';

			const rows = detailsRows(testCase, APPEAL_USER_ROLES.APPELLANT);
			expect(rows[lpaChangedDescriptionIndex].condition(testCase)).toBeTruthy();
			expect(rows[lpaChangedDescriptionIndex].keyText).toEqual('Preferred procedure');
			expect(rows[lpaChangedDescriptionIndex].valueText).toEqual('Inquiry\nFor reasons');
		});

		it('should not display the procedure preference if not set', () => {
			const testCase = structuredClone(caseWithAppellant);

			const rows = detailsRows(testCase, APPEAL_USER_ROLES.APPELLANT);
			expect(rows[lpaChangedDescriptionIndex].condition(testCase)).toBeFalsy();
		});
	});

	describe('Cost application', () => {
		const costsApplicationIndex = 34;

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
