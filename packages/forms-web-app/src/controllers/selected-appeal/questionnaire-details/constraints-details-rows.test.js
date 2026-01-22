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
	const advertsLPAQData = caseTypeLPAQFactory(CASE_TYPES.ADVERTS.processCode, 'constraints');
	const casAdvertsLPAQData = caseTypeLPAQFactory(CASE_TYPES.CAS_ADVERTS.processCode, 'constraints');
	const ldcLPAQData = caseTypeLPAQFactory(CASE_TYPES.LDC.processCode, 'constraints');
	const enforcementLPAQData = caseTypeLPAQFactory(
		CASE_TYPES.ENFORCEMENT.processCode,
		'constraints'
	);

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
			title: 'Is a commercial planning (CAS) appeal the correct type of appeal?',
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
		{ title: 'Affects a scheduled monument', value: 'Yes' },
		{ title: 'Conservation area', value: 'Yes' },
		{
			title: 'Uploaded conservation area map and guidance',
			value: 'name.pdf - awaiting review'
		},
		{ title: 'Protected species', value: 'Yes' },
		{ title: 'Green belt', value: 'Yes' },
		{ title: 'Is the site in a national landscape?', value: 'Yes' },
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

	const sharedAdvertsRows = [
		...sharedHasCasRows,
		{ title: 'Affects a scheduled monument', value: 'Yes' },
		{ title: 'Designated sites', value: 'Site A\nSite B' },
		{
			title: 'Is the site in an area of special control of advertisements?',
			value: 'Yes'
		}
	];

	const expectedRowsCasAdverts = [
		...sharedAdvertsRows,
		{
			title: 'Is a commercial advertisement appeal the correct type of appeal?',
			value: 'Yes'
		}
	];

	const expectedRowsAdverts = [
		...sharedAdvertsRows,
		{
			title: 'Is an advertisement appeal the correct type of appeal?',
			value: 'Yes'
		},
		{ title: 'Changes a listed building', value: 'Yes' },
		{ title: 'Listed building details', value: 'LB2' }
	];

	const expectedRowsLDC = [
		{
			title: 'Is a lawful development certificate appeal the correct type of appeal?',
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
		{ title: 'Is the site in a national landscape?', value: 'Yes' },
		{ title: 'Gypsy or Traveller', value: 'Yes' },
		{ title: 'Public right of way', value: 'Yes' }
	];

	const expectedRowsEnforcement = [
		{ title: 'Is an enforcement notice appeal the correct type of appeal?', value: 'Yes' },
		{ title: 'Changes a listed building', value: 'Yes' },
		{ title: 'Listed building details', value: 'LB2' },
		{ title: 'Affects a listed building', value: 'Yes' },
		{ title: 'Listed building details', value: 'LB1' },
		{ title: 'Affects a scheduled monument', value: 'Yes' },
		{ title: 'Conservation area', value: 'Yes' },
		{
			title: 'Uploaded conservation area map and guidance',
			value: 'name.pdf - awaiting review'
		},
		{ title: 'Protected species', value: 'Yes' },
		{ title: 'Green belt', value: 'Yes' },
		{ title: 'Is the site in a national landscape?', value: 'Yes' },
		{ title: 'Designated sites', value: 'Site A\nSite B' },
		{ title: 'Tree Preservation Order', value: 'Yes' },
		{
			title: 'Uploaded Tree Preservation Order extent',
			value: 'name.pdf - awaiting review'
		},
		{ title: 'Gypsy or Traveller', value: 'Yes' },
		{
			title: 'Uploaded definitive map and statement extract',
			value: 'name.pdf - awaiting review'
		},
		{ title: 'Notice relates to Building engineering, mining or other', value: 'Yes' },
		{ title: 'Total site area', value: '23 m\u00B2' },
		{ title: 'Has alleged breach area', value: 'Yes' },
		{ title: 'Does alleged breach creates floor space', value: 'Yes' },
		{ title: 'Changes use of land to dispose, refuse or waste materials', value: 'Yes' },
		{ title: 'Changes use of land to dispose of remaining materials', value: 'Yes' },
		{ title: 'Changes of use of land to store minerals', value: 'Yes' },
		{ title: 'Relates to Erection of building or buildings', value: 'Yes' },
		{ title: 'Relates to building with agricultural purpose', value: 'Yes' },
		{ title: 'Relates to building single dwelling house', value: 'Yes' },
		{ title: 'Affected trunk road name', value: 'TRUNK ROAD' },
		{ title: 'Is site on crown land', value: 'Yes' },
		{ title: 'Uploaded enforcement stop notice', value: 'name.pdf - awaiting review' },
		{ title: 'Uploaded article 4 direction', value: 'name.pdf - awaiting review' },
		{ title: 'Article 4 affected development rights', value: 'article 4 direction' }
	];

	it.each([
		['HAS', hasLPAQData, expectedRowsHas],
		['CAS Planning', casPlanningLPAQData, expectedRowsCasPlanning],
		['S78', s78LPAQData, expectedRowsS78],
		['S20', s20LPAQData, expectedRowsS20],
		['Adverts', advertsLPAQData, expectedRowsAdverts],
		['CAS Adverts', casAdvertsLPAQData, expectedRowsCasAdverts],
		['LDC', ldcLPAQData, expectedRowsLDC],
		['Enforcement', enforcementLPAQData, expectedRowsEnforcement]
	])(`should create correct rows for appeal type %s`, (_, caseData, expectedRows) => {
		const visibleRows = constraintsRows(caseData)
			.filter((row) => row.condition(caseData))
			.map((visibleRow) => {
				return { title: visibleRow.keyText, value: visibleRow.valueText };
			});
		expect(visibleRows).toEqual(expect.arrayContaining(expectedRows));
	});

	const ROW_COUNT = 36;
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
	const SPECIAL_ADVERT_ROW = 12;
	const GREEN_BELT_ROW = 13;
	const AREA_OUTSTANDING_BEAUTY_ROW = 14;
	const DESIGNATED_SITES_ROW = 15;
	const TREE_PRESERVATION_ORDER_ROW = 16;
	const TREE_PRESERVATION_PLAN_DOC_ROW = 17;
	const GYPSY_TRAVELLER_ROW = 18;
	const PUBLIC_RIGHT_OF_WAY_ROW = 19;
	const DEFINITIVE_MAP_STATEMENT_DOC_ROW = 20;
	const NOTICE_RELATES_TO_BUILDING_ENGINEERING_ROW = 21;
	const TOTAL_SITE_AREA_ROW = 22;
	const HAS_ALLEGED_BREACH_AREA_ROW = 23;
	const ALLEGED_BREACH_CREATES_FLOOR_SPACE_ROW = 24;
	const CHANGES_USE_DISPOSE_WASTE_MATERIALS_ROW = 25;
	const CHANGES_USE_DISPOSE_REMAINING_MATERIALS_ROW = 26;
	const CHANGES_USE_STORE_MINERALS_ROW = 27;
	const RELATES_TO_ERECTION_OF_BUILDINGS_ROW = 28;
	const RELATES_TO_AGRICULTURAL_PURPOSE_ROW = 29;
	const RELATES_TO_SINGLE_DWELLING_HOUSE_ROW = 30;
	const AFFECTED_TRUNK_ROAD_NAME_ROW = 31;
	const IS_SITE_ON_CROWN_LAND_ROW = 32;
	const ENFORCEMENT_STOP_NOTICE_DOC_ROW = 33;
	const ARTICLE_4_DIRECTION_DOC_ROW = 34;
	const ARTICLE_4_AFFECTED_RIGHTS_ROW = 35;

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
			noticeRelatesToBuildingEngineeringMiningOther: false,
			siteAreaSquareMetres: 23,
			hasAllegedBreachArea: false,
			doesAllegedBreachCreateFloorSpace: false,
			changeOfUseRefuseOrWaste: false,
			changeOfUseMineralExtraction: false,
			changeOfUseMineralStorage: false,
			relatesToErectionOfBuildingOrBuildings: false,
			relatesToBuildingWithAgriculturalPurpose: false,
			relatesToBuildingSingleDwellingHouse: false,
			affectedTrunkRoadName: 'TRUNK ROAD',
			isSiteOnCrownLand: false,
			article4AffectedDevelopmentRights: 'article 4 direction',
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

		expect(rows[SPECIAL_ADVERT_ROW].condition()).toEqual(false);
		expect(rows[SPECIAL_ADVERT_ROW].keyText).toEqual(
			'Is the site in an area of special control of advertisements?'
		);
		expect(rows[SPECIAL_ADVERT_ROW].valueText).toEqual('');

		expect(rows[GREEN_BELT_ROW].condition()).toEqual(true);
		expect(rows[GREEN_BELT_ROW].keyText).toEqual('Green belt');
		expect(rows[GREEN_BELT_ROW].valueText).toEqual('No');

		expect(rows[AREA_OUTSTANDING_BEAUTY_ROW].condition()).toEqual(true);
		expect(rows[AREA_OUTSTANDING_BEAUTY_ROW].keyText).toEqual(
			'Is the site in a national landscape?'
		);
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

		expect(rows[NOTICE_RELATES_TO_BUILDING_ENGINEERING_ROW].condition()).toEqual(true);
		expect(rows[NOTICE_RELATES_TO_BUILDING_ENGINEERING_ROW].keyText).toEqual(
			'Notice relates to Building engineering, mining or other'
		);
		expect(rows[NOTICE_RELATES_TO_BUILDING_ENGINEERING_ROW].valueText).toEqual('No');

		expect(rows[TOTAL_SITE_AREA_ROW].condition()).toEqual(true);
		expect(rows[TOTAL_SITE_AREA_ROW].keyText).toEqual('Total site area');
		expect(rows[TOTAL_SITE_AREA_ROW].valueText).toEqual('23 m\u00B2');

		expect(rows[HAS_ALLEGED_BREACH_AREA_ROW].condition()).toEqual(true);
		expect(rows[HAS_ALLEGED_BREACH_AREA_ROW].keyText).toEqual('Has alleged breach area');
		expect(rows[HAS_ALLEGED_BREACH_AREA_ROW].valueText).toEqual('No');

		expect(rows[ALLEGED_BREACH_CREATES_FLOOR_SPACE_ROW].condition()).toEqual(true);
		expect(rows[ALLEGED_BREACH_CREATES_FLOOR_SPACE_ROW].keyText).toEqual(
			'Does alleged breach creates floor space'
		);
		expect(rows[ALLEGED_BREACH_CREATES_FLOOR_SPACE_ROW].valueText).toEqual('No');

		expect(rows[CHANGES_USE_DISPOSE_WASTE_MATERIALS_ROW].condition()).toEqual(true);
		expect(rows[CHANGES_USE_DISPOSE_WASTE_MATERIALS_ROW].keyText).toEqual(
			'Changes use of land to dispose, refuse or waste materials'
		);
		expect(rows[CHANGES_USE_DISPOSE_WASTE_MATERIALS_ROW].valueText).toEqual('No');

		expect(rows[CHANGES_USE_DISPOSE_REMAINING_MATERIALS_ROW].condition()).toEqual(true);
		expect(rows[CHANGES_USE_DISPOSE_REMAINING_MATERIALS_ROW].keyText).toEqual(
			'Changes use of land to dispose of remaining materials'
		);
		expect(rows[CHANGES_USE_DISPOSE_REMAINING_MATERIALS_ROW].valueText).toEqual('No');

		expect(rows[CHANGES_USE_STORE_MINERALS_ROW].condition()).toEqual(true);
		expect(rows[CHANGES_USE_STORE_MINERALS_ROW].keyText).toEqual(
			'Changes of use of land to store minerals'
		);
		expect(rows[CHANGES_USE_STORE_MINERALS_ROW].valueText).toEqual('No');

		expect(rows[RELATES_TO_ERECTION_OF_BUILDINGS_ROW].condition()).toEqual(true);
		expect(rows[RELATES_TO_ERECTION_OF_BUILDINGS_ROW].keyText).toEqual(
			'Relates to Erection of building or buildings'
		);
		expect(rows[RELATES_TO_ERECTION_OF_BUILDINGS_ROW].valueText).toEqual('No');

		expect(rows[RELATES_TO_AGRICULTURAL_PURPOSE_ROW].condition()).toEqual(true);
		expect(rows[RELATES_TO_AGRICULTURAL_PURPOSE_ROW].keyText).toEqual(
			'Relates to building with agricultural purpose'
		);
		expect(rows[RELATES_TO_AGRICULTURAL_PURPOSE_ROW].valueText).toEqual('No');

		expect(rows[RELATES_TO_SINGLE_DWELLING_HOUSE_ROW].condition()).toEqual(true);
		expect(rows[RELATES_TO_SINGLE_DWELLING_HOUSE_ROW].keyText).toEqual(
			'Relates to building single dwelling house'
		);
		expect(rows[RELATES_TO_SINGLE_DWELLING_HOUSE_ROW].valueText).toEqual('No');

		expect(rows[AFFECTED_TRUNK_ROAD_NAME_ROW].condition()).toEqual(true);
		expect(rows[AFFECTED_TRUNK_ROAD_NAME_ROW].keyText).toEqual('Affected trunk road name');
		expect(rows[AFFECTED_TRUNK_ROAD_NAME_ROW].valueText).toEqual('TRUNK ROAD');

		expect(rows[IS_SITE_ON_CROWN_LAND_ROW].condition()).toEqual(true);
		expect(rows[IS_SITE_ON_CROWN_LAND_ROW].keyText).toEqual('Is site on crown land');
		expect(rows[IS_SITE_ON_CROWN_LAND_ROW].valueText).toEqual('No');

		expect(rows[ENFORCEMENT_STOP_NOTICE_DOC_ROW].condition()).toEqual(false);
		expect(rows[ENFORCEMENT_STOP_NOTICE_DOC_ROW].keyText).toEqual(
			'Uploaded enforcement stop notice'
		);
		expect(rows[ENFORCEMENT_STOP_NOTICE_DOC_ROW].valueText).toEqual('No');
		expect(rows[ENFORCEMENT_STOP_NOTICE_DOC_ROW].isEscaped).toEqual(true);

		expect(rows[ARTICLE_4_DIRECTION_DOC_ROW].condition()).toEqual(false);
		expect(rows[ARTICLE_4_DIRECTION_DOC_ROW].keyText).toEqual('Uploaded article 4 direction');
		expect(rows[ARTICLE_4_DIRECTION_DOC_ROW].valueText).toEqual('No');
		expect(rows[ARTICLE_4_DIRECTION_DOC_ROW].isEscaped).toEqual(true);

		expect(rows[ARTICLE_4_AFFECTED_RIGHTS_ROW].condition()).toEqual(true);
		expect(rows[ARTICLE_4_AFFECTED_RIGHTS_ROW].keyText).toEqual(
			'Article 4 affected development rights'
		);
		expect(rows[ARTICLE_4_AFFECTED_RIGHTS_ROW].valueText).toEqual('article 4 direction');
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
		expect(rows[NOTICE_RELATES_TO_BUILDING_ENGINEERING_ROW].condition()).toEqual(false);
		expect(rows[TOTAL_SITE_AREA_ROW].condition()).toEqual(false);
		expect(rows[HAS_ALLEGED_BREACH_AREA_ROW].condition()).toEqual(false);
		expect(rows[ALLEGED_BREACH_CREATES_FLOOR_SPACE_ROW].condition()).toEqual(false);
		expect(rows[CHANGES_USE_DISPOSE_WASTE_MATERIALS_ROW].condition()).toEqual(false);
		expect(rows[CHANGES_USE_DISPOSE_REMAINING_MATERIALS_ROW].condition()).toEqual(false);
		expect(rows[CHANGES_USE_STORE_MINERALS_ROW].condition()).toEqual(false);
		expect(rows[RELATES_TO_ERECTION_OF_BUILDINGS_ROW].condition()).toEqual(false);
		expect(rows[RELATES_TO_AGRICULTURAL_PURPOSE_ROW].condition()).toEqual(false);
		expect(rows[RELATES_TO_SINGLE_DWELLING_HOUSE_ROW].condition()).toEqual(false);
		expect(rows[AFFECTED_TRUNK_ROAD_NAME_ROW].condition()).toEqual(false);
		expect(rows[IS_SITE_ON_CROWN_LAND_ROW].condition()).toEqual(false);
		expect(rows[ENFORCEMENT_STOP_NOTICE_DOC_ROW].condition()).toEqual(false);
		expect(rows[ARTICLE_4_DIRECTION_DOC_ROW].condition()).toEqual(false);
		expect(rows[ARTICLE_4_AFFECTED_RIGHTS_ROW].condition()).toEqual(false);
	});
});
