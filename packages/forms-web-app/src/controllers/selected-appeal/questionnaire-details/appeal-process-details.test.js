const { APPEAL_CASE_PROCEDURE } = require('pins-data-model');
const { appealProcessRows } = require('./appeal-process-details-rows');
const { CASE_RELATION_TYPES } = require('@pins/common/src/database/data-static');

describe('appealProcessRows', () => {
	it('should create rows with correct data if relevant case data fields exist & field values populated', () => {
		const caseData = {
			lpaProcedurePreference: APPEAL_CASE_PROCEDURE.INQUIRY,
			lpaProcedurePreferenceDetails: 'inquiry preference',
			lpaProcedurePreferenceDuration: 6,
			changedDevelopmentDescription: true,
			newConditionDetails: 'new condition details',
			relations: [
				{
					id: 1,
					type: CASE_RELATION_TYPES.nearby,
					caseReference: '0000001',
					caseReference2: '0000002'
				}
			]
		};

		const rows = appealProcessRows(caseData);

		expect(rows.length).toEqual(4);
		expect(rows[0].keyText).toEqual('Appeal procedure');
		expect(rows[0].valueText).toEqual('Inquiry\ninquiry preference\nExpected duration: 6 days');
		expect(rows[0].condition()).toEqual(true);

		expect(rows[1].keyText).toEqual('Appeals near the site');
		expect(rows[1].valueText).toEqual('Yes');
		expect(rows[1].condition()).toEqual(true);

		expect(rows[2].keyText).toEqual('Appeal references');
		expect(rows[2].valueText).toEqual('0000002');
		expect(rows[2].condition()).toEqual(true);

		expect(rows[3].keyText).toEqual('Extra conditions');
		expect(rows[3].valueText).toEqual('Yes\nnew condition details');
		expect(rows[3].condition()).toEqual(true);
	});

	it('should handle false values correctly', () => {
		const caseData = {
			changedDevelopmentDescription: false,
			newConditionDetails: false,
			relations: []
		};

		const rows = appealProcessRows(caseData);

		expect(rows.length).toEqual(4);
		expect(rows[0].keyText).toEqual('Appeal procedure');
		expect(rows[0].condition()).toEqual(false);

		expect(rows[1].keyText).toEqual('Appeals near the site');
		expect(rows[1].valueText).toEqual('No');
		expect(rows[1].condition()).toEqual(true);
		expect(rows[2].keyText).toEqual('Appeal references');
		expect(rows[2].condition()).toEqual(false);

		expect(rows[3].keyText).toEqual('Extra conditions');
		expect(rows[3].valueText).toEqual('No');
		expect(rows[3].condition()).toEqual(true);
	});

	it('should not display if no fields/files exists', () => {
		const rows = appealProcessRows({});

		expect(rows.length).toEqual(4);
		expect(rows[0].condition()).toEqual(false);
		expect(rows[1].condition()).toEqual(false);
		expect(rows[2].condition()).toEqual(false);
		expect(rows[3].condition()).toEqual(false);
	});
});
