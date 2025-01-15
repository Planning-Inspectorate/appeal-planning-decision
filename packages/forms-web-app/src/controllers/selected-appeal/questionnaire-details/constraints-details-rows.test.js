const { APPEALS_CASE_DATA } = require('@pins/common/src/constants');
const { LISTED_RELATION_TYPES } = require('@pins/common/src/database/data-static');
const { constraintsRows } = require('./constraints-details-rows');
const { APPEAL_DOCUMENT_TYPE } = require('pins-data-model');

describe('constraintsRows', () => {
	it('should create rows with correct data if relevant case data fields exist and field values true/files uploaded/otherwise populated', () => {
		const caseData = {
			ListedBuildings: [
				{
					listedBuildingReference: 'Building 1',
					type: LISTED_RELATION_TYPES.affected
				},
				{
					listedBuildingReference: 'Building 2',
					type: LISTED_RELATION_TYPES.affected
				},
				{
					listedBuildingReference: 'Building 3',
					type: LISTED_RELATION_TYPES.changed
				},
				{
					listedBuildingReference: 'Building 4',
					type: LISTED_RELATION_TYPES.changed
				}
			],
			scheduledMonument: true,
			isCorrectAppealType: true,
			protectedSpecies: true,
			isGreenBelt: true,
			areaOutstandingBeauty: true,
			designatedSites: 'Yes',
			treePreservationOrder: true,
			gypsyTraveller: true,
			publicRightOfWay: true,
			Documents: [
				{
					documentType: APPEAL_DOCUMENT_TYPE.TREE_PRESERVATION_PLAN,
					id: '12347',
					filename: 'tree.pdf',
					redacted: true
				},
				{
					documentType: APPEAL_DOCUMENT_TYPE.DEFINITIVE_MAP_STATEMENT,
					id: '12348',
					filename: 'definitive-statement.pdf',
					redacted: true
				}
			]
		};
		const rows = constraintsRows(caseData);
		expect(rows.length).toEqual(17);
		expect(rows[0].condition()).toEqual(true);
		expect(rows[0].keyText).toEqual('Is this the correct type of appeal');
		expect(rows[0].valueText).toEqual('Yes');

		expect(rows[1].condition()).toEqual(true);
		expect(rows[1].keyText).toEqual('Changes a listed building');
		expect(rows[1].valueText).toEqual('Yes');

		expect(rows[2].condition()).toEqual(true);
		expect(rows[2].keyText).toEqual('Listed building details');
		expect(rows[2].valueText).toEqual('Building 3\nBuilding 4');

		expect(rows[3].condition()).toEqual(true);
		expect(rows[3].keyText).toEqual('Affects a listed building');
		expect(rows[3].valueText).toEqual('Yes');

		expect(rows[4].condition()).toEqual(true);
		expect(rows[4].keyText).toEqual('Listed building details');
		expect(rows[4].valueText).toEqual('Building 1\nBuilding 2');

		expect(rows[5].condition()).toEqual(true);
		expect(rows[5].keyText).toEqual('Affects a scheduled monument');
		expect(rows[5].valueText).toEqual('Yes');

		expect(rows[6].condition()).toEqual(true);
		expect(rows[6].keyText).toEqual('Conservation area');
		expect(rows[6].valueText).toEqual('No');

		expect(rows[7].condition()).toEqual(false);
		expect(rows[7].keyText).toEqual('Uploaded conservation area map and guidance');
		expect(rows[7].valueText).toEqual('No');
		expect(rows[7].isEscaped).toEqual(true);

		expect(rows[8].condition()).toEqual(true);
		expect(rows[8].keyText).toEqual('Protected species');
		expect(rows[8].valueText).toEqual('Yes');

		expect(rows[9].condition()).toEqual(true);
		expect(rows[9].keyText).toEqual('Green belt');
		expect(rows[9].valueText).toEqual('Yes');

		expect(rows[10].condition()).toEqual(true);
		expect(rows[10].keyText).toEqual('Area of outstanding natural beauty');
		expect(rows[10].valueText).toEqual('Yes');

		expect(rows[11].condition()).toEqual(true);
		expect(rows[11].keyText).toEqual('Designated sites');
		expect(rows[11].valueText).toEqual('Yes');

		expect(rows[12].condition()).toEqual(true);
		expect(rows[12].keyText).toEqual('Tree Preservation Order');
		expect(rows[12].valueText).toEqual('Yes');

		expect(rows[13].condition()).toEqual(true);
		expect(rows[13].keyText).toEqual('Uploaded Tree Preservation Order extent');
		expect(rows[13].valueText).toEqual(
			'<a href="/published-document/12347" class="govuk-link">tree.pdf</a>'
		);
		expect(rows[13].isEscaped).toEqual(true);

		expect(rows[14].condition()).toEqual(true);
		expect(rows[14].keyText).toEqual('Gypsy or Traveller');
		expect(rows[14].valueText).toEqual('Yes');

		expect(rows[15].condition()).toEqual(true);
		expect(rows[15].keyText).toEqual('Public right of way');
		expect(rows[15].valueText).toEqual('Yes');

		expect(rows[16].condition()).toEqual(true);
		expect(rows[16].keyText).toEqual('Uploaded definitive map and statement extract');
		expect(rows[16].valueText).toEqual(
			'<a href="/published-document/12348" class="govuk-link">definitive-statement.pdf</a>'
		);
		expect(rows[16].isEscaped).toEqual(true);
	});

	it('should create rows with correct data if relevant case data fields and field values false/no files uploaded/otherwise not populated', () => {
		const caseData = {
			ListedBuildings: [],
			scheduledMonument: false,
			isCorrectAppealType: false,
			protectedSpecies: false,
			isGreenBelt: false,
			areaOutstandingBeauty: false,
			designatedSites: 'None',
			treePreservationOrder: false,
			gypsyTraveller: false,
			publicRightOfWay: false,
			Documents: []
		};
		const rows = constraintsRows(caseData);
		expect(rows.length).toEqual(17);
		expect(rows[0].condition()).toEqual(true);
		expect(rows[0].keyText).toEqual('Is this the correct type of appeal');
		expect(rows[0].valueText).toEqual('No');

		expect(rows[1].condition()).toEqual(false);
		expect(rows[1].keyText).toEqual('Changes a listed building');
		expect(rows[1].valueText).toEqual('No');

		expect(rows[2].condition()).toEqual(false);
		expect(rows[2].keyText).toEqual('Listed building details');
		expect(rows[2].valueText).toEqual('');

		expect(rows[3].condition()).toEqual(false);
		expect(rows[3].keyText).toEqual('Affects a listed building');
		expect(rows[3].valueText).toEqual('No');

		expect(rows[4].condition()).toEqual(false);
		expect(rows[4].keyText).toEqual('Listed building details');
		expect(rows[4].valueText).toEqual('');

		expect(rows[5].condition()).toEqual(true);
		expect(rows[5].keyText).toEqual('Affects a scheduled monument');
		expect(rows[5].valueText).toEqual('No');

		expect(rows[6].condition()).toEqual(true);
		expect(rows[6].keyText).toEqual('Conservation area');
		expect(rows[6].valueText).toEqual('No');

		expect(rows[7].condition()).toEqual(false);
		expect(rows[7].keyText).toEqual('Uploaded conservation area map and guidance');
		expect(rows[7].valueText).toEqual('No');
		expect(rows[7].isEscaped).toEqual(true);

		expect(rows[8].condition()).toEqual(true);
		expect(rows[8].keyText).toEqual('Protected species');
		expect(rows[8].valueText).toEqual('No');

		expect(rows[9].condition()).toEqual(true);
		expect(rows[9].keyText).toEqual('Green belt');
		expect(rows[9].valueText).toEqual('No');

		expect(rows[10].condition()).toEqual(true);
		expect(rows[10].keyText).toEqual('Area of outstanding natural beauty');
		expect(rows[10].valueText).toEqual('No');

		expect(rows[11].condition()).toEqual(true);
		expect(rows[11].keyText).toEqual('Designated sites');
		expect(rows[11].valueText).toEqual('No');

		expect(rows[12].condition()).toEqual(true);
		expect(rows[12].keyText).toEqual('Tree Preservation Order');
		expect(rows[12].valueText).toEqual('No');

		expect(rows[13].condition()).toEqual(false);
		expect(rows[13].keyText).toEqual('Uploaded Tree Preservation Order extent');
		expect(rows[13].valueText).toEqual('No');
		expect(rows[13].isEscaped).toEqual(true);

		expect(rows[14].condition()).toEqual(true);
		expect(rows[14].keyText).toEqual('Gypsy or Traveller');
		expect(rows[14].valueText).toEqual('No');

		expect(rows[15].condition()).toEqual(true);
		expect(rows[15].keyText).toEqual('Public right of way');
		expect(rows[15].valueText).toEqual('No');

		expect(rows[16].condition()).toEqual(false);
		expect(rows[16].keyText).toEqual('Uploaded definitive map and statement extract');
		expect(rows[16].valueText).toEqual('No');
		expect(rows[16].isEscaped).toEqual(true);
	});

	it('should create rows with correct conditions if fields do not exist', () => {
		const rows = constraintsRows({ Documents: [] });
		expect(rows.length).toEqual(17);
		expect(rows[0].condition()).toEqual(false);
		expect(rows[1].condition()).toEqual(false);
		expect(rows[2].condition()).toEqual(false);
		expect(rows[3].condition()).toEqual(false);
		expect(rows[4].condition()).toEqual(false);
		expect(rows[5].condition()).toEqual(false);
		expect(rows[6].condition()).toEqual(true);
		expect(rows[7].condition()).toEqual(false);
		expect(rows[8].condition()).toEqual(false);
		expect(rows[9].condition()).toEqual(false);
		expect(rows[10].condition()).toEqual(false);
		expect(rows[11].condition()).toEqual(false);
		expect(rows[12].condition()).toEqual(false);
		expect(rows[13].condition()).toEqual(false);
		expect(rows[14].condition()).toEqual(false);
		expect(rows[15].condition()).toEqual(false);
		expect(rows[16].condition()).toEqual(false);
	});

	it('should create rows with correct data for HAS appeal', () => {
		const caseData = {
			appealTypeCode: APPEALS_CASE_DATA.APPEAL_TYPE_CODE.HAS,
			isCorrectAppealType: true,
			ListedBuildings: [
				{
					listedBuildingReference: 'Building 1',
					type: LISTED_RELATION_TYPES.affected
				},
				{
					listedBuildingReference: 'Building 2',
					type: LISTED_RELATION_TYPES.affected
				},
				{
					listedBuildingReference: 'Building 3',
					type: LISTED_RELATION_TYPES.changed
				},
				{
					listedBuildingReference: 'Building 4',
					type: LISTED_RELATION_TYPES.changed
				}
			],
			scheduledMonument: false,
			isGreenBelt: true,
			Documents: [
				{
					documentType: APPEAL_DOCUMENT_TYPE.CONSERVATION_MAP,
					id: '12345',
					filename: 'conservationmap1.pdf',
					redacted: true
				},
				{
					documentType: APPEAL_DOCUMENT_TYPE.CONSERVATION_MAP,
					id: '12346',
					filename: 'conservationmap2.pdf',
					redacted: true
				}
			]
		};
		const rows = constraintsRows(caseData);

		expect(rows.length).toEqual(17);
		expect(rows[0].condition()).toEqual(true);
		expect(rows[0].keyText).toEqual('Is this the correct type of appeal');
		expect(rows[0].valueText).toEqual('Yes');

		expect(rows[1].condition()).toEqual(true);
		expect(rows[1].keyText).toEqual('Changes a listed building');
		expect(rows[1].valueText).toEqual('Yes');

		expect(rows[2].condition()).toEqual(true);
		expect(rows[2].keyText).toEqual('Listed building details');
		expect(rows[2].valueText).toEqual('Building 3\nBuilding 4');

		expect(rows[3].condition()).toEqual(true);
		expect(rows[3].keyText).toEqual('Affects a listed building');
		expect(rows[3].valueText).toEqual('Yes');

		expect(rows[4].condition()).toEqual(true);
		expect(rows[4].keyText).toEqual('Listed building details');
		expect(rows[4].valueText).toEqual('Building 1\nBuilding 2');

		expect(rows[5].condition()).toEqual(false);

		expect(rows[6].condition()).toEqual(true);
		expect(rows[6].keyText).toEqual('Conservation area');
		expect(rows[6].valueText).toEqual('Yes');

		expect(rows[7].condition()).toEqual(true);
		expect(rows[7].keyText).toEqual('Uploaded conservation area map and guidance');
		expect(rows[7].valueText).toEqual(
			'<a href="/published-document/12345" class="govuk-link">conservationmap1.pdf</a>\n<a href="/published-document/12346" class="govuk-link">conservationmap2.pdf</a>'
		);
		expect(rows[7].isEscaped).toEqual(true);

		expect(rows[8].condition()).toEqual(false);

		expect(rows[9].condition()).toEqual(true);
		expect(rows[9].keyText).toEqual('Green belt');
		expect(rows[9].valueText).toEqual('Yes');

		expect(rows[10].condition()).toEqual(false);
		expect(rows[11].condition()).toEqual(false);
		expect(rows[12].condition()).toEqual(false);
		expect(rows[13].condition()).toEqual(false);
		expect(rows[14].condition()).toEqual(false);
		expect(rows[15].condition()).toEqual(false);
		expect(rows[16].condition()).toEqual(false);
	});
});
