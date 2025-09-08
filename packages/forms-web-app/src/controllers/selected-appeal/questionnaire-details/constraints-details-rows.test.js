const { CASE_TYPES } = require('@pins/common/src/database/data-static');
const { constraintsRows } = require('./constraints-details-rows');
const { caseTypeLPAQFactory } = require('./test-factory');

describe('constraintsRows', () => {
	const hasLPAQData = caseTypeLPAQFactory(CASE_TYPES.HAS.processCode, 'constraints');
	const casPlanningLPAQData = caseTypeLPAQFactory(
		CASE_TYPES.CAS_PLANNING.processCode,
		'constraints'
	);
	const s78LPAQData = caseTypeLPAQFactory(CASE_TYPES.S78.processCode, 'constraints');
	const s20LPAQData = caseTypeLPAQFactory(CASE_TYPES.S20.processCode, 'constraints');

	const sharedHasCasRows = [
		{ title: 'Affects a listed building', value: 'Yes' },
		{ title: 'Listed building details', value: 'LB1' },
		{ title: 'Conservation area', value: 'Yes' },
		{
			title: 'Uploaded conservation area map and guidance',
			value: 'name.pdf - awaiting review'
		},
		{ title: 'Green belt', value: 'Yes' }
	];
	const expectedRowsHas = [
		{
			title: 'Is a householder appeal the correct type of appeal?',
			value: 'Yes'
		},
		...sharedHasCasRows
	];
	const expectedRowsCasPlanning = [
		{
			title: 'Is a commercial planning (cas) appeal the correct type of appeal?',
			value: 'Yes'
		},
		...sharedHasCasRows
	];
	const expectedRowsS78 = [
		{
			title: 'Is a planning appeal the correct type of appeal?',
			value: 'Yes'
		},
		{ title: 'Changes a listed building', value: 'Yes' },
		{ title: 'Listed building details', value: 'LB2' },
		{ title: 'Affects a listed building', value: 'Yes' },
		{ title: 'Listed building details', value: 'LB1' },
		{ title: 'Conservation area', value: 'Yes' },
		{
			title: 'Uploaded conservation area map and guidance',
			value: 'name.pdf - awaiting review'
		},
		{ title: 'Protected species', value: 'Yes' },
		{ title: 'Green belt', value: 'Yes' },
		{ title: 'Area of outstanding natural beauty', value: 'Yes' },
		{ title: 'Designated sites', value: 'Site A\nSite B' },
		{ title: 'Tree Preservation Order', value: 'Yes' },
		{
			title: 'Uploaded Tree Preservation Order extent',
			value: 'name.pdf - awaiting review'
		},
		{ title: 'Gypsy or Traveller', value: 'Yes' },
		{ title: 'Public right of way', value: 'Yes' },
		{
			title: 'Uploaded definitive map and statement extract',
			value: 'name.pdf - awaiting review'
		}
	];

	const expectedRowsS20 = [
		{
			title:
				'Is a planning listed building and conservation area appeal the correct type of appeal?',
			value: 'Yes'
		},
		...expectedRowsS78.slice(1, 5),
		{
			title: 'Was a grant or loan made to preserve the listed building at the appeal site?',
			value: 'Yes'
		},
		{ title: 'Was Historic England consulted?', value: 'Yes' },
		{
			title: 'Uploaded consultation with Historic England',
			value: 'name.pdf - awaiting review'
		},
		...expectedRowsS78.slice(5, expectedRowsS78.length - 1)
	];

	it.each([
		['HAS', hasLPAQData, expectedRowsHas],
		['CAS Planning', casPlanningLPAQData, expectedRowsCasPlanning],
		['S78', s78LPAQData, expectedRowsS78],
		['S20', s20LPAQData, expectedRowsS20]
	])(`should create correct rows for appeal type %s`, (_, caseData, expectedRows) => {
		const visibleRows = constraintsRows(caseData)
			.filter((row) => row.condition(caseData))
			.map((visibleRow) => {
				return { title: visibleRow.keyText, value: visibleRow.valueText };
			});
		expect(visibleRows).toEqual(expectedRows);
	});

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
});
