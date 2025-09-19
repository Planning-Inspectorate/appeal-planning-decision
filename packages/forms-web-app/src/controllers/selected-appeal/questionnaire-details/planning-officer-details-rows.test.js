const { planningOfficerReportRows } = require('./planning-officer-details-rows');
const { APPEAL_DOCUMENT_TYPE } = require('@planning-inspectorate/data-model');
const { CASE_TYPES } = require('@pins/common/src/database/data-static');
const { caseTypeLPAQFactory } = require('./test-factory');

const date = new Date('2020-12-17T03:24:00');
const formattedDate = '17 Dec 2020';

describe('planningOfficerReportRows', () => {
	const hasLPAQData = caseTypeLPAQFactory(CASE_TYPES.HAS.processCode, 'planningOfficersReport');
	const casPlanningLPAQData = caseTypeLPAQFactory(
		CASE_TYPES.CAS_PLANNING.processCode,
		'planningOfficersReport'
	);
	const s78LPAQData = caseTypeLPAQFactory(CASE_TYPES.S78.processCode, 'planningOfficersReport');
	const s20LPAQData = caseTypeLPAQFactory(CASE_TYPES.S20.processCode, 'planningOfficersReport');
	const advertsLPAQData = caseTypeLPAQFactory(
		CASE_TYPES.ADVERTS.processCode,
		'planningOfficersReport'
	);
	const casAdvertsLPAQData = caseTypeLPAQFactory(
		CASE_TYPES.CAS_ADVERTS.processCode,
		'planningOfficersReport'
	);

	const expectedRowsHas = [
		{
			title: "Planning officer's report",
			value: 'name.pdf - awaiting review'
		},
		{
			title: 'Plans, drawings and list of plans',
			value: 'name.pdf - awaiting review'
		},
		{
			title: 'Policies from statutory development plan',
			value: 'name.pdf - awaiting review'
		},
		{ title: 'Emerging plan', value: 'Yes' },
		{
			title: 'Uploaded emerging plan and supporting information',
			value: 'name.pdf - awaiting review'
		},
		{
			title: 'Uploaded other relevant policies',
			value: 'name.pdf - awaiting review'
		},
		{ title: 'Supplementary planning documents', value: 'Yes' },
		{
			title: 'Uploaded supplementary planning documents',
			value: 'name.pdf - awaiting review'
		}
	];
	const expectedCasPlanningRows = [
		{
			title: "Planning officer's report",
			value: 'name.pdf - awaiting review'
		},
		{
			title: 'Policies from statutory development plan',
			value: 'name.pdf - awaiting review'
		},
		{ title: 'Emerging plan', value: 'No' },
		{ title: 'Supplementary planning documents', value: 'Yes' },
		{
			title: 'Uploaded supplementary planning documents',
			value: 'name.pdf - awaiting review'
		}
	];
	const expectedRowsS78 = [
		{
			title: "Planning officer's report",
			value: 'name.pdf - awaiting review'
		},
		{
			title: 'Policies from statutory development plan',
			value: 'name.pdf - awaiting review'
		},
		{ title: 'Emerging plan', value: 'Yes' },
		{
			title: 'Uploaded emerging plan and supporting information',
			value: 'name.pdf - awaiting review'
		},
		{
			title: 'Uploaded other relevant policies',
			value: 'name.pdf - awaiting review'
		},
		{ title: 'Supplementary planning documents', value: 'Yes' },
		{
			title: 'Uploaded supplementary planning documents',
			value: 'name.pdf - awaiting review'
		},
		{ title: 'Community infrastructure levy', value: 'Yes' },
		{
			title: 'Uploaded community infrastructure levy',
			value: 'name.pdf - awaiting review'
		},
		{
			title: 'Community infrastructure levy formally adopted',
			value: 'Yes'
		},
		{
			title: 'Date community infrastructure levy adopted',
			value: '1 Jan 2023'
		}
	];
	const expectedRowsAdverts = [
		{
			title: 'Did you refuse the application because of highway or traffic public safety?',
			value: 'Yes'
		}
	];

	it.each([
		['HAS', hasLPAQData, expectedRowsHas],
		['CAS Planning', casPlanningLPAQData, expectedCasPlanningRows],
		['S78', s78LPAQData, expectedRowsS78],
		['S20', s20LPAQData, expectedRowsS78],
		['Adverts', advertsLPAQData, expectedRowsAdverts],
		['CAS Adverts', casAdvertsLPAQData, expectedRowsAdverts]
	])(`should create correct rows for appeal type %s`, (_, caseData, expectedRows) => {
		const visibleRows = planningOfficerReportRows(caseData)
			.filter((row) => row.condition(caseData))
			.map((visibleRow) => {
				return { title: visibleRow.keyText, value: visibleRow.valueText };
			});
		expect(visibleRows).toEqual(expect.arrayContaining(expectedRows));
	});

	const PLANNING_OFFICER_REPORT_ROW = 0;
	const HIGHWAY_TRAFFIC_SAFETY = 1;
	const PLANS_DRAWINGS_ROW = 2;
	const POLICIES_STATUTORY_DEVELOPMENT_PLAN_ROW = 3;
	const EMERGING_PLAN_ROW = 4;
	const UPLOADED_EMERGING_PLAN_ROW = 5;
	const UPLOADED_OTHER_RELEVANT_POLICIES_ROW = 6;
	const SUPPLEMENTARY_PLANNING_DOCUMENTS_ROW = 7;
	const UPLOADED_SUPPLEMENTARY_PLANNING_DOCUMENTS_ROW = 8;
	const COMMUNITY_INFRASTRUCTURE_LEVY_ROW = 9;
	const UPLOADED_COMMUNITY_INFRASTRUCTURE_LEVY_ROW = 10;
	const COMMUNITY_INFRASTRUCTURE_LEVY_FORMALLY_ADOPTED_ROW = 11;
	const DATE_COMMUNITY_INFRASTRUCTURE_LEVY_ADOPTED_ROW = 12;
	const DATE_COMMUNITY_INFRASTRUCTURE_LEVY_EXPECTED_TO_BE_ADOPTED_ROW = 13;

	it('should create row with correct data if relevant case fields exist and files uploaded/field values otherwise populated', () => {
		const caseData = {
			appealTypeCode: CASE_TYPES.HAS.processCode,
			infrastructureLevy: true,
			infrastructureLevyAdopted: true,
			infrastructureLevyAdoptedDate: date,
			infrastructureLevyExpectedDate: date,
			wasApplicationRefusedDueToHighwayOrTraffic: true,
			Documents: [
				{
					documentType: APPEAL_DOCUMENT_TYPE.PLANNING_OFFICER_REPORT,
					id: '12345',
					filename: 'po-report.pdf',
					redacted: true
				},
				{
					documentType: APPEAL_DOCUMENT_TYPE.PLANS_DRAWINGS,
					id: '12346',
					filename: 'plans-drawings.pdf',
					redacted: true
				},
				{
					documentType: APPEAL_DOCUMENT_TYPE.DEVELOPMENT_PLAN_POLICIES,
					id: '12347',
					filename: 'dev-plan-policies.pdf',
					redacted: true
				},
				{
					documentType: APPEAL_DOCUMENT_TYPE.EMERGING_PLAN,
					id: '12348',
					filename: 'emerging-plan.pdf',
					redacted: true
				},
				{
					documentType: APPEAL_DOCUMENT_TYPE.OTHER_RELEVANT_POLICIES,
					id: '12349',
					filename: 'other-policies.pdf',
					redacted: true
				},
				{
					documentType: APPEAL_DOCUMENT_TYPE.SUPPLEMENTARY_PLANNING,
					id: '12350',
					filename: 'supplementary-planning.pdf',
					redacted: true
				},
				{
					documentType: APPEAL_DOCUMENT_TYPE.COMMUNITY_INFRASTRUCTURE_LEVY,
					id: '12351',
					filename: 'community-infrastructure-levy.pdf',
					redacted: true
				}
			]
		};

		const rows = planningOfficerReportRows(caseData);
		expect(rows.length).toEqual(14);

		expect(rows[PLANNING_OFFICER_REPORT_ROW].condition()).toEqual(true);
		expect(rows[PLANNING_OFFICER_REPORT_ROW].isEscaped).toEqual(true);
		expect(rows[PLANNING_OFFICER_REPORT_ROW].keyText).toEqual("Planning officer's report");
		expect(rows[PLANNING_OFFICER_REPORT_ROW].valueText).toEqual(
			'<a href="/published-document/12345" class="govuk-link">po-report.pdf</a>'
		);

		expect(rows[HIGHWAY_TRAFFIC_SAFETY].condition()).toEqual(true);
		expect(rows[HIGHWAY_TRAFFIC_SAFETY].keyText).toEqual(
			'Did you refuse the application because of highway or traffic public safety?'
		);
		expect(rows[HIGHWAY_TRAFFIC_SAFETY].valueText).toEqual('Yes');

		expect(rows[PLANS_DRAWINGS_ROW].condition()).toEqual(true);
		expect(rows[PLANS_DRAWINGS_ROW].isEscaped).toEqual(true);
		expect(rows[PLANS_DRAWINGS_ROW].keyText).toEqual('Plans, drawings and list of plans');
		expect(rows[PLANS_DRAWINGS_ROW].valueText).toEqual(
			'<a href="/published-document/12346" class="govuk-link">plans-drawings.pdf</a>'
		);

		expect(rows[POLICIES_STATUTORY_DEVELOPMENT_PLAN_ROW].condition()).toEqual(true);
		expect(rows[POLICIES_STATUTORY_DEVELOPMENT_PLAN_ROW].isEscaped).toEqual(true);
		expect(rows[POLICIES_STATUTORY_DEVELOPMENT_PLAN_ROW].keyText).toEqual(
			'Policies from statutory development plan'
		);
		expect(rows[POLICIES_STATUTORY_DEVELOPMENT_PLAN_ROW].valueText).toEqual(
			'<a href="/published-document/12347" class="govuk-link">dev-plan-policies.pdf</a>'
		);

		expect(rows[EMERGING_PLAN_ROW].condition()).toEqual(true);
		expect(rows[EMERGING_PLAN_ROW].keyText).toEqual('Emerging plan');
		expect(rows[EMERGING_PLAN_ROW].valueText).toEqual('Yes');

		expect(rows[UPLOADED_EMERGING_PLAN_ROW].condition()).toEqual(true);
		expect(rows[UPLOADED_EMERGING_PLAN_ROW].isEscaped).toEqual(true);
		expect(rows[UPLOADED_EMERGING_PLAN_ROW].keyText).toEqual(
			'Uploaded emerging plan and supporting information'
		);
		expect(rows[UPLOADED_EMERGING_PLAN_ROW].valueText).toEqual(
			'<a href="/published-document/12348" class="govuk-link">emerging-plan.pdf</a>'
		);

		expect(rows[UPLOADED_OTHER_RELEVANT_POLICIES_ROW].condition()).toEqual(true);
		expect(rows[UPLOADED_OTHER_RELEVANT_POLICIES_ROW].isEscaped).toEqual(true);
		expect(rows[UPLOADED_OTHER_RELEVANT_POLICIES_ROW].keyText).toEqual(
			'Uploaded other relevant policies'
		);
		expect(rows[UPLOADED_OTHER_RELEVANT_POLICIES_ROW].valueText).toEqual(
			'<a href="/published-document/12349" class="govuk-link">other-policies.pdf</a>'
		);

		expect(rows[SUPPLEMENTARY_PLANNING_DOCUMENTS_ROW].condition()).toEqual(true);
		expect(rows[SUPPLEMENTARY_PLANNING_DOCUMENTS_ROW].keyText).toEqual(
			'Supplementary planning documents'
		);
		expect(rows[SUPPLEMENTARY_PLANNING_DOCUMENTS_ROW].valueText).toEqual('Yes');

		expect(rows[UPLOADED_SUPPLEMENTARY_PLANNING_DOCUMENTS_ROW].condition()).toEqual(true);
		expect(rows[UPLOADED_SUPPLEMENTARY_PLANNING_DOCUMENTS_ROW].isEscaped).toEqual(true);
		expect(rows[UPLOADED_SUPPLEMENTARY_PLANNING_DOCUMENTS_ROW].keyText).toEqual(
			'Uploaded supplementary planning documents'
		);
		expect(rows[UPLOADED_SUPPLEMENTARY_PLANNING_DOCUMENTS_ROW].valueText).toEqual(
			'<a href="/published-document/12350" class="govuk-link">supplementary-planning.pdf</a>'
		);

		expect(rows[COMMUNITY_INFRASTRUCTURE_LEVY_ROW].condition()).toEqual(true);
		expect(rows[COMMUNITY_INFRASTRUCTURE_LEVY_ROW].keyText).toEqual(
			'Community infrastructure levy'
		);
		expect(rows[COMMUNITY_INFRASTRUCTURE_LEVY_ROW].valueText).toEqual('Yes');

		expect(rows[UPLOADED_COMMUNITY_INFRASTRUCTURE_LEVY_ROW].condition()).toEqual(true);
		expect(rows[UPLOADED_COMMUNITY_INFRASTRUCTURE_LEVY_ROW].isEscaped).toEqual(true);
		expect(rows[UPLOADED_COMMUNITY_INFRASTRUCTURE_LEVY_ROW].keyText).toEqual(
			'Uploaded community infrastructure levy'
		);
		expect(rows[UPLOADED_COMMUNITY_INFRASTRUCTURE_LEVY_ROW].valueText).toEqual(
			'<a href="/published-document/12351" class="govuk-link">community-infrastructure-levy.pdf</a>'
		);

		expect(rows[COMMUNITY_INFRASTRUCTURE_LEVY_FORMALLY_ADOPTED_ROW].condition()).toEqual(true);
		expect(rows[COMMUNITY_INFRASTRUCTURE_LEVY_FORMALLY_ADOPTED_ROW].keyText).toEqual(
			'Community infrastructure levy formally adopted'
		);
		expect(rows[COMMUNITY_INFRASTRUCTURE_LEVY_FORMALLY_ADOPTED_ROW].valueText).toEqual('Yes');

		expect(rows[DATE_COMMUNITY_INFRASTRUCTURE_LEVY_ADOPTED_ROW].condition()).toEqual(true);
		expect(rows[DATE_COMMUNITY_INFRASTRUCTURE_LEVY_ADOPTED_ROW].keyText).toEqual(
			'Date community infrastructure levy adopted'
		);
		expect(rows[DATE_COMMUNITY_INFRASTRUCTURE_LEVY_ADOPTED_ROW].valueText).toEqual(formattedDate);

		expect(rows[DATE_COMMUNITY_INFRASTRUCTURE_LEVY_EXPECTED_TO_BE_ADOPTED_ROW].condition()).toEqual(
			true
		);
		expect(rows[DATE_COMMUNITY_INFRASTRUCTURE_LEVY_EXPECTED_TO_BE_ADOPTED_ROW].keyText).toEqual(
			'Date community infrastructure levy expected to be adopted'
		);
		expect(rows[DATE_COMMUNITY_INFRASTRUCTURE_LEVY_EXPECTED_TO_BE_ADOPTED_ROW].valueText).toEqual(
			formattedDate
		);
	});

	it('should handle false values correctly', () => {
		const caseData = {
			appealTypeCode: CASE_TYPES.HAS.processCode,
			infrastructureLevy: false,
			infrastructureLevyAdopted: false,
			wasApplicationRefusedDueToHighwayOrTraffic: false,
			Documents: []
		};

		const rows = planningOfficerReportRows(caseData);

		expect(rows[HIGHWAY_TRAFFIC_SAFETY].condition()).toEqual(true);
		expect(rows[HIGHWAY_TRAFFIC_SAFETY].keyText).toEqual(
			'Did you refuse the application because of highway or traffic public safety?'
		);
		expect(rows[HIGHWAY_TRAFFIC_SAFETY].valueText).toEqual('No');

		expect(rows[EMERGING_PLAN_ROW].condition()).toEqual(true);
		expect(rows[EMERGING_PLAN_ROW].keyText).toEqual('Emerging plan');
		expect(rows[EMERGING_PLAN_ROW].valueText).toEqual('No');

		expect(rows[SUPPLEMENTARY_PLANNING_DOCUMENTS_ROW].condition()).toEqual(true);
		expect(rows[SUPPLEMENTARY_PLANNING_DOCUMENTS_ROW].keyText).toEqual(
			'Supplementary planning documents'
		);
		expect(rows[SUPPLEMENTARY_PLANNING_DOCUMENTS_ROW].valueText).toEqual('No');

		expect(rows[COMMUNITY_INFRASTRUCTURE_LEVY_ROW].condition()).toEqual(true);
		expect(rows[COMMUNITY_INFRASTRUCTURE_LEVY_ROW].keyText).toEqual(
			'Community infrastructure levy'
		);
		expect(rows[COMMUNITY_INFRASTRUCTURE_LEVY_ROW].valueText).toEqual('No');

		expect(rows[COMMUNITY_INFRASTRUCTURE_LEVY_FORMALLY_ADOPTED_ROW].condition()).toEqual(true);
		expect(rows[COMMUNITY_INFRASTRUCTURE_LEVY_FORMALLY_ADOPTED_ROW].keyText).toEqual(
			'Community infrastructure levy formally adopted'
		);
		expect(rows[COMMUNITY_INFRASTRUCTURE_LEVY_FORMALLY_ADOPTED_ROW].valueText).toEqual('No');
	});

	it('should return correct conditions if no fields/files exist', () => {
		const rows = planningOfficerReportRows({ Documents: [] });

		expect(rows.length).toEqual(14);
		expect(rows[PLANNING_OFFICER_REPORT_ROW].condition()).toEqual(false);
		expect(rows[HIGHWAY_TRAFFIC_SAFETY].condition()).toEqual(false);
		expect(rows[PLANS_DRAWINGS_ROW].condition()).toEqual(false);
		expect(rows[POLICIES_STATUTORY_DEVELOPMENT_PLAN_ROW].condition()).toEqual(false);
		expect(rows[EMERGING_PLAN_ROW].condition()).toEqual(true);
		expect(rows[UPLOADED_EMERGING_PLAN_ROW].condition()).toEqual(false);
		expect(rows[UPLOADED_OTHER_RELEVANT_POLICIES_ROW].condition()).toEqual(false);
		expect(rows[SUPPLEMENTARY_PLANNING_DOCUMENTS_ROW].condition()).toEqual(true);
		expect(rows[UPLOADED_SUPPLEMENTARY_PLANNING_DOCUMENTS_ROW].condition()).toEqual(false);
		expect(rows[COMMUNITY_INFRASTRUCTURE_LEVY_ROW].condition()).toEqual(false);
		expect(rows[UPLOADED_COMMUNITY_INFRASTRUCTURE_LEVY_ROW].condition()).toEqual(false);
		expect(rows[COMMUNITY_INFRASTRUCTURE_LEVY_FORMALLY_ADOPTED_ROW].condition()).toEqual(false);
		expect(rows[DATE_COMMUNITY_INFRASTRUCTURE_LEVY_ADOPTED_ROW].condition()).toEqual(false);
		expect(rows[DATE_COMMUNITY_INFRASTRUCTURE_LEVY_EXPECTED_TO_BE_ADOPTED_ROW].condition()).toEqual(
			false
		);
	});

	it('should set plans, drawings and list of plans condition as false if not HAS appeal type', () => {
		const caseData = {
			appealTypeCode: CASE_TYPES.S78.processCode,
			infrastructureLevy: true,
			infrastructureLevyAdopted: true,
			infrastructureLevyAdoptedDate: date,
			infrastructureLevyExpectedDate: date,
			Documents: [
				{
					documentType: APPEAL_DOCUMENT_TYPE.PLANS_DRAWINGS,
					id: '12346',
					filename: 'plans-drawings.pdf',
					redacted: true
				}
			]
		};

		const rows = planningOfficerReportRows(caseData);

		expect(rows[PLANS_DRAWINGS_ROW].condition()).toEqual(false);
		expect(rows[PLANS_DRAWINGS_ROW].isEscaped).toEqual(true);
		expect(rows[PLANS_DRAWINGS_ROW].keyText).toEqual('Plans, drawings and list of plans');
		expect(rows[PLANS_DRAWINGS_ROW].valueText).toEqual(
			'<a href="/published-document/12346" class="govuk-link">plans-drawings.pdf</a>'
		);
	});
});
