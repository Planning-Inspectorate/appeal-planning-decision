const { planningOfficerReportRows } = require('./planning-officer-details-rows');
const { APPEAL_DOCUMENT_TYPE } = require('@planning-inspectorate/data-model');
const { CASE_TYPES } = require('@pins/common/src/database/data-static');

const date = new Date('2020-12-17T03:24:00');
const formattedDate = '17 Dec 2020';

describe('planningOfficerReportRows', () => {
	it('should create row with correct data if relevant case fields exist and files uploaded/field values otherwise populated', () => {
		const caseData = {
			appealTypeCode: CASE_TYPES.HAS.processCode,
			infrastructureLevy: true,
			infrastructureLevyAdopted: true,
			infrastructureLevyAdoptedDate: date,
			infrastructureLevyExpectedDate: date,
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
		expect(rows.length).toEqual(13);

		expect(rows[0].condition()).toEqual(true);
		expect(rows[0].isEscaped).toEqual(true);
		expect(rows[0].keyText).toEqual("Planning officer's report");
		expect(rows[0].valueText).toEqual(
			'<a href="/published-document/12345" class="govuk-link">po-report.pdf</a>'
		);

		expect(rows[1].condition()).toEqual(true);
		expect(rows[1].isEscaped).toEqual(true);
		expect(rows[1].keyText).toEqual('Plans, drawings and list of plans');
		expect(rows[1].valueText).toEqual(
			'<a href="/published-document/12346" class="govuk-link">plans-drawings.pdf</a>'
		);

		expect(rows[2].condition()).toEqual(true);
		expect(rows[2].isEscaped).toEqual(true);
		expect(rows[2].keyText).toEqual('Policies from statutory development plan');
		expect(rows[2].valueText).toEqual(
			'<a href="/published-document/12347" class="govuk-link">dev-plan-policies.pdf</a>'
		);

		expect(rows[3].condition()).toEqual(true);
		expect(rows[3].keyText).toEqual('Emerging plan');
		expect(rows[3].valueText).toEqual('Yes');

		expect(rows[4].condition()).toEqual(true);
		expect(rows[4].isEscaped).toEqual(true);
		expect(rows[4].keyText).toEqual('Uploaded emerging plan and supporting information');
		expect(rows[4].valueText).toEqual(
			'<a href="/published-document/12348" class="govuk-link">emerging-plan.pdf</a>'
		);

		expect(rows[5].condition()).toEqual(true);
		expect(rows[5].isEscaped).toEqual(true);
		expect(rows[5].keyText).toEqual('Uploaded other relevant policies');
		expect(rows[5].valueText).toEqual(
			'<a href="/published-document/12349" class="govuk-link">other-policies.pdf</a>'
		);

		expect(rows[6].condition()).toEqual(true);
		expect(rows[6].keyText).toEqual('Supplementary planning documents');
		expect(rows[6].valueText).toEqual('Yes');

		expect(rows[7].condition()).toEqual(true);
		expect(rows[7].isEscaped).toEqual(true);
		expect(rows[7].keyText).toEqual('Uploaded supplementary planning documents');
		expect(rows[7].valueText).toEqual(
			'<a href="/published-document/12350" class="govuk-link">supplementary-planning.pdf</a>'
		);

		expect(rows[8].condition()).toEqual(true);
		expect(rows[8].keyText).toEqual('Community infrastructure levy');
		expect(rows[8].valueText).toEqual('Yes');

		expect(rows[9].condition()).toEqual(true);
		expect(rows[9].isEscaped).toEqual(true);
		expect(rows[9].keyText).toEqual('Uploaded community infrastructure levy');
		expect(rows[9].valueText).toEqual(
			'<a href="/published-document/12351" class="govuk-link">community-infrastructure-levy.pdf</a>'
		);

		expect(rows[10].condition()).toEqual(true);
		expect(rows[10].keyText).toEqual('Community infrastructure levy formally adopted');
		expect(rows[10].valueText).toEqual('Yes');

		expect(rows[11].condition()).toEqual(true);
		expect(rows[11].keyText).toEqual('Date community infrastructure levy adopted');
		expect(rows[11].valueText).toEqual(formattedDate);

		expect(rows[12].condition()).toEqual(true);
		expect(rows[12].keyText).toEqual('Date community infrastructure levy expected to be adopted');
		expect(rows[12].valueText).toEqual(formattedDate);
	});
	it('should handle false values correctly', () => {
		const caseData = {
			appealTypeCode: CASE_TYPES.HAS.processCode,
			infrastructureLevy: false,
			infrastructureLevyAdopted: false,
			Documents: []
		};

		const rows = planningOfficerReportRows(caseData);

		expect(rows[3].condition()).toEqual(true);
		expect(rows[3].keyText).toEqual('Emerging plan');
		expect(rows[3].valueText).toEqual('No');

		expect(rows[6].condition()).toEqual(true);
		expect(rows[6].keyText).toEqual('Supplementary planning documents');
		expect(rows[6].valueText).toEqual('No');

		expect(rows[8].condition()).toEqual(true);
		expect(rows[8].keyText).toEqual('Community infrastructure levy');
		expect(rows[8].valueText).toEqual('No');

		expect(rows[10].condition()).toEqual(true);
		expect(rows[10].keyText).toEqual('Community infrastructure levy formally adopted');
		expect(rows[10].valueText).toEqual('No');
	});

	it('should return correct conditions if no fields/files exist', () => {
		const rows = planningOfficerReportRows({ Documents: [] });

		expect(rows.length).toEqual(13);
		expect(rows[0].condition()).toEqual(false);
		expect(rows[1].condition()).toEqual(false);
		expect(rows[2].condition()).toEqual(false);
		expect(rows[3].condition()).toEqual(true);
		expect(rows[4].condition()).toEqual(false);
		expect(rows[5].condition()).toEqual(false);
		expect(rows[6].condition()).toEqual(true);
		expect(rows[7].condition()).toEqual(false);
		expect(rows[8].condition()).toEqual(false);
		expect(rows[9].condition()).toEqual(false);
		expect(rows[10].condition()).toEqual(false);
		expect(rows[11].condition()).toEqual(false);
		expect(rows[12].condition()).toEqual(false);
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

		expect(rows[1].condition()).toEqual(false);
		expect(rows[1].isEscaped).toEqual(true);
		expect(rows[1].keyText).toEqual('Plans, drawings and list of plans');
		expect(rows[1].valueText).toEqual(
			'<a href="/published-document/12346" class="govuk-link">plans-drawings.pdf</a>'
		);
	});
});
