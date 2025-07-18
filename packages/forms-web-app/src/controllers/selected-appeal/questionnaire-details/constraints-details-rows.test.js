const { CASE_TYPES } = require('@pins/common/src/database/data-static');

const { LISTED_RELATION_TYPES } = require('@pins/common/src/database/data-static');
const { constraintsRows } = require('./constraints-details-rows');
const { APPEAL_DOCUMENT_TYPE } = require('@planning-inspectorate/data-model');

describe('constraintsRows', () => {
	const ROW_COUNT = 20;
	const CORRECT_APPEAL_TYPE_ROW = 0;
	const CHANGES_LISTED_BUILDING_ROW = 1;
	const CHANGED_LISTED_BUILDING_DETAILS_ROW = 2;
	const AFFECTS_LISTED_BUILDING_ROW = 3;
	const AFFECTED_LISTED_BUILDING_DETAILS_ROW = 4;
	const PRESERVE_GRANT_LOAN_ROW = 5;
	const CONSULT_HISTORIC_ENGLAND_ROW = 6;
	const HISTORIC_ENGLAND_CONSULTATION_DOC_ROW = 7;
	const AFFECTS_SCHEDULED_MONUMENT_ROW = 8;
	const CONSERVATION_AREA_ROW = 9;
	const CONSERVATION_MAP_DOC_ROW = 10;
	const PROTECTED_SPECIES_ROW = 11;
	const GREEN_BELT_ROW = 12;
	const AREA_OUTSTANDING_BEAUTY_ROW = 13;
	const DESIGNATED_SITES_ROW = 14;
	const TREE_PRESERVATION_ORDER_ROW = 15;
	const TREE_PRESERVATION_PLAN_DOC_ROW = 16;
	const GYPSY_TRAVELLER_ROW = 17;
	const PUBLIC_RIGHT_OF_WAY_ROW = 18;
	const DEFINITIVE_MAP_STATEMENT_DOC_ROW = 19;

	it('should create rows with correct data if relevant case data fields exist and field values true/files uploaded/otherwise populated', () => {
		const caseData = {
			appealTypeCode: CASE_TYPES.S78.processCode,
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
			preserveGrantLoan: true,
			consultHistoricEngland: true,
			scheduledMonument: true,
			isCorrectAppealType: true,
			protectedSpecies: true,
			isGreenBelt: true,
			areaOutstandingBeauty: true,
			designatedSitesNames: ['Yes'],
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
				},
				{
					documentType: APPEAL_DOCUMENT_TYPE.HISTORIC_ENGLAND_CONSULTATION,
					id: '12349',
					filename: 'consultation.pdf',
					redacted: true
				}
			]
		};
		const rows = constraintsRows(caseData);
		expect(rows.length).toEqual(ROW_COUNT);
		expect(rows[CORRECT_APPEAL_TYPE_ROW].condition()).toEqual(true);
		expect(rows[CORRECT_APPEAL_TYPE_ROW].keyText).toEqual(
			'Is a planning appeal the correct type of appeal?'
		);
		expect(rows[CORRECT_APPEAL_TYPE_ROW].valueText).toEqual('Yes');

		expect(rows[CHANGES_LISTED_BUILDING_ROW].condition()).toEqual(true);
		expect(rows[CHANGES_LISTED_BUILDING_ROW].keyText).toEqual('Changes a listed building');
		expect(rows[CHANGES_LISTED_BUILDING_ROW].valueText).toEqual('Yes');

		expect(rows[CHANGED_LISTED_BUILDING_DETAILS_ROW].condition()).toEqual(true);
		expect(rows[CHANGED_LISTED_BUILDING_DETAILS_ROW].keyText).toEqual('Listed building details');
		expect(rows[CHANGED_LISTED_BUILDING_DETAILS_ROW].valueText).toEqual('Building 3\nBuilding 4');

		expect(rows[AFFECTS_LISTED_BUILDING_ROW].condition()).toEqual(true);
		expect(rows[AFFECTS_LISTED_BUILDING_ROW].keyText).toEqual('Affects a listed building');
		expect(rows[AFFECTS_LISTED_BUILDING_ROW].valueText).toEqual('Yes');

		expect(rows[AFFECTED_LISTED_BUILDING_DETAILS_ROW].condition()).toEqual(true);
		expect(rows[AFFECTED_LISTED_BUILDING_DETAILS_ROW].keyText).toEqual('Listed building details');
		expect(rows[AFFECTED_LISTED_BUILDING_DETAILS_ROW].valueText).toEqual('Building 1\nBuilding 2');

		expect(rows[PRESERVE_GRANT_LOAN_ROW].condition()).toEqual(true);
		expect(rows[PRESERVE_GRANT_LOAN_ROW].keyText).toEqual(
			'Was a grant or loan made to preserve the listed building at the appeal site?'
		);
		expect(rows[PRESERVE_GRANT_LOAN_ROW].valueText).toEqual('Yes');

		expect(rows[CONSULT_HISTORIC_ENGLAND_ROW].condition()).toEqual(true);
		expect(rows[CONSULT_HISTORIC_ENGLAND_ROW].keyText).toEqual('Was Historic England consulted?');
		expect(rows[CONSULT_HISTORIC_ENGLAND_ROW].valueText).toEqual('Yes');

		expect(rows[HISTORIC_ENGLAND_CONSULTATION_DOC_ROW].condition()).toEqual(true);
		expect(rows[HISTORIC_ENGLAND_CONSULTATION_DOC_ROW].keyText).toEqual(
			'Uploaded consultation with Historic England'
		);
		expect(rows[HISTORIC_ENGLAND_CONSULTATION_DOC_ROW].valueText).toEqual(
			'<a href="/published-document/12349" class="govuk-link">consultation.pdf</a>'
		);
		expect(rows[HISTORIC_ENGLAND_CONSULTATION_DOC_ROW].isEscaped).toEqual(true);

		expect(rows[AFFECTS_SCHEDULED_MONUMENT_ROW].condition()).toEqual(true);
		expect(rows[AFFECTS_SCHEDULED_MONUMENT_ROW].keyText).toEqual('Affects a scheduled monument');
		expect(rows[AFFECTS_SCHEDULED_MONUMENT_ROW].valueText).toEqual('Yes');

		expect(rows[CONSERVATION_AREA_ROW].condition()).toEqual(true);
		expect(rows[CONSERVATION_AREA_ROW].keyText).toEqual('Conservation area');
		expect(rows[CONSERVATION_AREA_ROW].valueText).toEqual('No');

		expect(rows[CONSERVATION_MAP_DOC_ROW].condition()).toEqual(false);
		expect(rows[CONSERVATION_MAP_DOC_ROW].keyText).toEqual(
			'Uploaded conservation area map and guidance'
		);
		expect(rows[CONSERVATION_MAP_DOC_ROW].valueText).toEqual('No');
		expect(rows[CONSERVATION_MAP_DOC_ROW].isEscaped).toEqual(true);

		expect(rows[PROTECTED_SPECIES_ROW].condition()).toEqual(true);
		expect(rows[PROTECTED_SPECIES_ROW].keyText).toEqual('Protected species');
		expect(rows[PROTECTED_SPECIES_ROW].valueText).toEqual('Yes');

		expect(rows[GREEN_BELT_ROW].condition()).toEqual(true);
		expect(rows[GREEN_BELT_ROW].keyText).toEqual('Green belt');
		expect(rows[GREEN_BELT_ROW].valueText).toEqual('Yes');

		expect(rows[AREA_OUTSTANDING_BEAUTY_ROW].condition()).toEqual(true);
		expect(rows[AREA_OUTSTANDING_BEAUTY_ROW].keyText).toEqual('Area of outstanding natural beauty');
		expect(rows[AREA_OUTSTANDING_BEAUTY_ROW].valueText).toEqual('Yes');

		expect(rows[DESIGNATED_SITES_ROW].condition()).toEqual(true);
		expect(rows[DESIGNATED_SITES_ROW].keyText).toEqual('Designated sites');
		expect(rows[DESIGNATED_SITES_ROW].valueText).toEqual('Yes');

		expect(rows[TREE_PRESERVATION_ORDER_ROW].condition()).toEqual(true);
		expect(rows[TREE_PRESERVATION_ORDER_ROW].keyText).toEqual('Tree Preservation Order');
		expect(rows[TREE_PRESERVATION_ORDER_ROW].valueText).toEqual('Yes');

		expect(rows[TREE_PRESERVATION_PLAN_DOC_ROW].condition()).toEqual(true);
		expect(rows[TREE_PRESERVATION_PLAN_DOC_ROW].keyText).toEqual(
			'Uploaded Tree Preservation Order extent'
		);
		expect(rows[TREE_PRESERVATION_PLAN_DOC_ROW].valueText).toEqual(
			'<a href="/published-document/12347" class="govuk-link">tree.pdf</a>'
		);
		expect(rows[TREE_PRESERVATION_PLAN_DOC_ROW].isEscaped).toEqual(true);

		expect(rows[GYPSY_TRAVELLER_ROW].condition()).toEqual(true);
		expect(rows[GYPSY_TRAVELLER_ROW].keyText).toEqual('Gypsy or Traveller');
		expect(rows[GYPSY_TRAVELLER_ROW].valueText).toEqual('Yes');

		expect(rows[PUBLIC_RIGHT_OF_WAY_ROW].condition()).toEqual(true);
		expect(rows[PUBLIC_RIGHT_OF_WAY_ROW].keyText).toEqual('Public right of way');
		expect(rows[PUBLIC_RIGHT_OF_WAY_ROW].valueText).toEqual('Yes');

		expect(rows[DEFINITIVE_MAP_STATEMENT_DOC_ROW].condition()).toEqual(true);
		expect(rows[DEFINITIVE_MAP_STATEMENT_DOC_ROW].keyText).toEqual(
			'Uploaded definitive map and statement extract'
		);
		expect(rows[DEFINITIVE_MAP_STATEMENT_DOC_ROW].valueText).toEqual(
			'<a href="/published-document/12348" class="govuk-link">definitive-statement.pdf</a>'
		);
		expect(rows[DEFINITIVE_MAP_STATEMENT_DOC_ROW].isEscaped).toEqual(true);
	});

	it('should create rows with correct data if relevant case data fields and field values false/no files uploaded/otherwise not populated', () => {
		const caseData = {
			appealTypeCode: CASE_TYPES.S78.processCode,
			ListedBuildings: [],
			preserveGrantLoan: false,
			consultHistoricEngland: false,
			scheduledMonument: false,
			isCorrectAppealType: false,
			protectedSpecies: false,
			isGreenBelt: false,
			areaOutstandingBeauty: false,
			designatedSites: [],
			gypsyTraveller: false,
			publicRightOfWay: false,
			Documents: []
		};
		const rows = constraintsRows(caseData);
		expect(rows.length).toEqual(ROW_COUNT);
		expect(rows[CORRECT_APPEAL_TYPE_ROW].condition()).toEqual(true);
		expect(rows[CORRECT_APPEAL_TYPE_ROW].keyText).toEqual(
			'Is a planning appeal the correct type of appeal?'
		);
		expect(rows[CORRECT_APPEAL_TYPE_ROW].valueText).toEqual('No');

		expect(rows[CHANGES_LISTED_BUILDING_ROW].condition()).toEqual(true);
		expect(rows[CHANGES_LISTED_BUILDING_ROW].keyText).toEqual('Changes a listed building');
		expect(rows[CHANGES_LISTED_BUILDING_ROW].valueText).toEqual('No');

		expect(rows[CHANGED_LISTED_BUILDING_DETAILS_ROW].condition()).toEqual(false);
		expect(rows[CHANGED_LISTED_BUILDING_DETAILS_ROW].keyText).toEqual('Listed building details');
		expect(rows[CHANGED_LISTED_BUILDING_DETAILS_ROW].valueText).toEqual('');

		expect(rows[AFFECTS_LISTED_BUILDING_ROW].condition()).toEqual(true);
		expect(rows[AFFECTS_LISTED_BUILDING_ROW].keyText).toEqual('Affects a listed building');
		expect(rows[AFFECTS_LISTED_BUILDING_ROW].valueText).toEqual('No');

		expect(rows[AFFECTED_LISTED_BUILDING_DETAILS_ROW].condition()).toEqual(false);
		expect(rows[AFFECTED_LISTED_BUILDING_DETAILS_ROW].keyText).toEqual('Listed building details');
		expect(rows[AFFECTED_LISTED_BUILDING_DETAILS_ROW].valueText).toEqual('');

		expect(rows[PRESERVE_GRANT_LOAN_ROW].condition()).toEqual(true);
		expect(rows[PRESERVE_GRANT_LOAN_ROW].keyText).toEqual(
			'Was a grant or loan made to preserve the listed building at the appeal site?'
		);
		expect(rows[PRESERVE_GRANT_LOAN_ROW].valueText).toEqual('No');

		expect(rows[CONSULT_HISTORIC_ENGLAND_ROW].condition()).toEqual(true);
		expect(rows[CONSULT_HISTORIC_ENGLAND_ROW].keyText).toEqual('Was Historic England consulted?');
		expect(rows[CONSULT_HISTORIC_ENGLAND_ROW].valueText).toEqual('No');

		expect(rows[HISTORIC_ENGLAND_CONSULTATION_DOC_ROW].condition()).toEqual(false);
		expect(rows[HISTORIC_ENGLAND_CONSULTATION_DOC_ROW].keyText).toEqual(
			'Uploaded consultation with Historic England'
		);
		expect(rows[HISTORIC_ENGLAND_CONSULTATION_DOC_ROW].valueText).toEqual('No');
		expect(rows[HISTORIC_ENGLAND_CONSULTATION_DOC_ROW].isEscaped).toEqual(true);

		expect(rows[AFFECTS_SCHEDULED_MONUMENT_ROW].condition()).toEqual(true);
		expect(rows[AFFECTS_SCHEDULED_MONUMENT_ROW].keyText).toEqual('Affects a scheduled monument');
		expect(rows[AFFECTS_SCHEDULED_MONUMENT_ROW].valueText).toEqual('No');

		expect(rows[CONSERVATION_AREA_ROW].condition()).toEqual(true);
		expect(rows[CONSERVATION_AREA_ROW].keyText).toEqual('Conservation area');
		expect(rows[CONSERVATION_AREA_ROW].valueText).toEqual('No');

		expect(rows[CONSERVATION_MAP_DOC_ROW].condition()).toEqual(false);
		expect(rows[CONSERVATION_MAP_DOC_ROW].keyText).toEqual(
			'Uploaded conservation area map and guidance'
		);
		expect(rows[CONSERVATION_MAP_DOC_ROW].valueText).toEqual('No');
		expect(rows[CONSERVATION_MAP_DOC_ROW].isEscaped).toEqual(true);

		expect(rows[PROTECTED_SPECIES_ROW].condition()).toEqual(true);
		expect(rows[PROTECTED_SPECIES_ROW].keyText).toEqual('Protected species');
		expect(rows[PROTECTED_SPECIES_ROW].valueText).toEqual('No');

		expect(rows[GREEN_BELT_ROW].condition()).toEqual(true);
		expect(rows[GREEN_BELT_ROW].keyText).toEqual('Green belt');
		expect(rows[GREEN_BELT_ROW].valueText).toEqual('No');

		expect(rows[AREA_OUTSTANDING_BEAUTY_ROW].condition()).toEqual(true);
		expect(rows[AREA_OUTSTANDING_BEAUTY_ROW].keyText).toEqual('Area of outstanding natural beauty');
		expect(rows[AREA_OUTSTANDING_BEAUTY_ROW].valueText).toEqual('No');

		expect(rows[DESIGNATED_SITES_ROW].condition()).toEqual(true);
		expect(rows[DESIGNATED_SITES_ROW].keyText).toEqual('Designated sites');
		expect(rows[DESIGNATED_SITES_ROW].valueText).toEqual('No');

		expect(rows[TREE_PRESERVATION_ORDER_ROW].condition()).toEqual(true);
		expect(rows[TREE_PRESERVATION_ORDER_ROW].keyText).toEqual('Tree Preservation Order');
		expect(rows[TREE_PRESERVATION_ORDER_ROW].valueText).toEqual('No');

		expect(rows[TREE_PRESERVATION_PLAN_DOC_ROW].condition()).toEqual(false);
		expect(rows[TREE_PRESERVATION_PLAN_DOC_ROW].keyText).toEqual(
			'Uploaded Tree Preservation Order extent'
		);
		expect(rows[TREE_PRESERVATION_PLAN_DOC_ROW].valueText).toEqual('No');
		expect(rows[TREE_PRESERVATION_PLAN_DOC_ROW].isEscaped).toEqual(true);

		expect(rows[GYPSY_TRAVELLER_ROW].condition()).toEqual(true);
		expect(rows[GYPSY_TRAVELLER_ROW].keyText).toEqual('Gypsy or Traveller');
		expect(rows[GYPSY_TRAVELLER_ROW].valueText).toEqual('No');

		expect(rows[PUBLIC_RIGHT_OF_WAY_ROW].condition()).toEqual(true);
		expect(rows[PUBLIC_RIGHT_OF_WAY_ROW].keyText).toEqual('Public right of way');
		expect(rows[PUBLIC_RIGHT_OF_WAY_ROW].valueText).toEqual('No');

		expect(rows[DEFINITIVE_MAP_STATEMENT_DOC_ROW].condition()).toEqual(false);
		expect(rows[DEFINITIVE_MAP_STATEMENT_DOC_ROW].keyText).toEqual(
			'Uploaded definitive map and statement extract'
		);
		expect(rows[DEFINITIVE_MAP_STATEMENT_DOC_ROW].valueText).toEqual('No');
		expect(rows[DEFINITIVE_MAP_STATEMENT_DOC_ROW].isEscaped).toEqual(true);
	});

	it('should create rows with correct conditions if fields do not exist', () => {
		const rows = constraintsRows({ appealTypeCode: CASE_TYPES.S78.processCode, Documents: [] });
		expect(rows.length).toEqual(ROW_COUNT);
		expect(rows[CORRECT_APPEAL_TYPE_ROW].condition()).toEqual(false);
		expect(rows[CHANGES_LISTED_BUILDING_ROW].condition()).toEqual(true);
		expect(rows[CHANGED_LISTED_BUILDING_DETAILS_ROW].condition()).toEqual(false);
		expect(rows[AFFECTS_LISTED_BUILDING_ROW].condition()).toEqual(true);
		expect(rows[AFFECTED_LISTED_BUILDING_DETAILS_ROW].condition()).toEqual(false);
		expect(rows[PRESERVE_GRANT_LOAN_ROW].condition()).toEqual(false);
		expect(rows[CONSULT_HISTORIC_ENGLAND_ROW].condition()).toEqual(false);
		expect(rows[HISTORIC_ENGLAND_CONSULTATION_DOC_ROW].condition()).toEqual(false);
		expect(rows[AFFECTS_SCHEDULED_MONUMENT_ROW].condition()).toEqual(false);
		expect(rows[CONSERVATION_AREA_ROW].condition()).toEqual(true);
		expect(rows[CONSERVATION_MAP_DOC_ROW].condition()).toEqual(false);
		expect(rows[PROTECTED_SPECIES_ROW].condition()).toEqual(false);
		expect(rows[GREEN_BELT_ROW].condition()).toEqual(false);
		expect(rows[AREA_OUTSTANDING_BEAUTY_ROW].condition()).toEqual(false);
		expect(rows[DESIGNATED_SITES_ROW].condition()).toEqual(true);
		expect(rows[TREE_PRESERVATION_ORDER_ROW].condition()).toEqual(true);
		expect(rows[TREE_PRESERVATION_PLAN_DOC_ROW].condition()).toEqual(false);
		expect(rows[GYPSY_TRAVELLER_ROW].condition()).toEqual(false);
		expect(rows[PUBLIC_RIGHT_OF_WAY_ROW].condition()).toEqual(false);
		expect(rows[DEFINITIVE_MAP_STATEMENT_DOC_ROW].condition()).toEqual(false);
	});

	it('should create rows with correct data for HAS appeal', () => {
		const caseData = {
			appealTypeCode: CASE_TYPES.HAS.processCode,
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

		expect(rows.length).toEqual(ROW_COUNT);
		expect(rows[CORRECT_APPEAL_TYPE_ROW].condition()).toEqual(true);
		expect(rows[CORRECT_APPEAL_TYPE_ROW].keyText).toEqual(
			'Is a householder appeal the correct type of appeal?'
		);
		expect(rows[CORRECT_APPEAL_TYPE_ROW].valueText).toEqual('Yes');

		expect(rows[CHANGES_LISTED_BUILDING_ROW].condition()).toEqual(false);
		expect(rows[CHANGES_LISTED_BUILDING_ROW].keyText).toEqual('Changes a listed building');
		expect(rows[CHANGES_LISTED_BUILDING_ROW].valueText).toEqual('Yes');

		expect(rows[CHANGED_LISTED_BUILDING_DETAILS_ROW].condition()).toEqual(true);
		expect(rows[CHANGED_LISTED_BUILDING_DETAILS_ROW].keyText).toEqual('Listed building details');
		expect(rows[CHANGED_LISTED_BUILDING_DETAILS_ROW].valueText).toEqual('Building 3\nBuilding 4');

		expect(rows[AFFECTS_LISTED_BUILDING_ROW].condition()).toEqual(true);
		expect(rows[AFFECTS_LISTED_BUILDING_ROW].keyText).toEqual('Affects a listed building');
		expect(rows[AFFECTS_LISTED_BUILDING_ROW].valueText).toEqual('Yes');

		expect(rows[AFFECTED_LISTED_BUILDING_DETAILS_ROW].condition()).toEqual(true);
		expect(rows[AFFECTED_LISTED_BUILDING_DETAILS_ROW].keyText).toEqual('Listed building details');
		expect(rows[AFFECTED_LISTED_BUILDING_DETAILS_ROW].valueText).toEqual('Building 1\nBuilding 2');

		expect(rows[AFFECTS_SCHEDULED_MONUMENT_ROW].condition()).toEqual(false);

		expect(rows[CONSERVATION_AREA_ROW].condition()).toEqual(true);
		expect(rows[CONSERVATION_AREA_ROW].keyText).toEqual('Conservation area');
		expect(rows[CONSERVATION_AREA_ROW].valueText).toEqual('Yes');

		expect(rows[CONSERVATION_MAP_DOC_ROW].condition()).toEqual(true);
		expect(rows[CONSERVATION_MAP_DOC_ROW].keyText).toEqual(
			'Uploaded conservation area map and guidance'
		);
		expect(rows[CONSERVATION_MAP_DOC_ROW].valueText).toEqual(
			'<a href="/published-document/12345" class="govuk-link">conservationmap1.pdf</a>\n<a href="/published-document/12346" class="govuk-link">conservationmap2.pdf</a>'
		);
		expect(rows[CONSERVATION_MAP_DOC_ROW].isEscaped).toEqual(true);

		expect(rows[PROTECTED_SPECIES_ROW].condition()).toEqual(false);

		expect(rows[GREEN_BELT_ROW].condition()).toEqual(true);
		expect(rows[GREEN_BELT_ROW].keyText).toEqual('Green belt');
		expect(rows[GREEN_BELT_ROW].valueText).toEqual('Yes');

		expect(rows[AREA_OUTSTANDING_BEAUTY_ROW].condition()).toEqual(false);
		expect(rows[DESIGNATED_SITES_ROW].condition()).toEqual(false);
		expect(rows[TREE_PRESERVATION_ORDER_ROW].condition()).toEqual(false);
		expect(rows[TREE_PRESERVATION_PLAN_DOC_ROW].condition()).toEqual(false);
		expect(rows[GYPSY_TRAVELLER_ROW].condition()).toEqual(false);
		expect(rows[PUBLIC_RIGHT_OF_WAY_ROW].condition()).toEqual(false);
		expect(rows[DEFINITIVE_MAP_STATEMENT_DOC_ROW].condition()).toEqual(false);
	});
});
