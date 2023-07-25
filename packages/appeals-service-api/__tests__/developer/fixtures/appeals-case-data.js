const uuid = require('uuid');

const fakeAppealsCaseData = () => {
	const invalidTestAppeals = [
		//valid is an empty string
		_generateFakeAppeal('0000000', '1234567/abc', new Date(Date.UTC(2023, 0, 31)), '', ''),
		//valid is null
		_generateFakeAppeal('0000001', '1234567/def', new Date(Date.UTC(2023, 0, 31)), '', null),
		//valid is undefined
		_generateFakeAppeal('0000002', '1234567/ghi', new Date(Date.UTC(2023, 0, 31)), '', undefined),
		//valid string is not the required string
		_generateFakeAppeal('0000003', '1234567/jkl', new Date(Date.UTC(2023, 0, 31)), '', 'Not valid'),
		//questionnaire due date is null
		_generateFakeAppeal('0000004', '1234567/mno', null, '', 'Valid'),
		//questionnaire due date is an empty string
		_generateFakeAppeal('0000005', '1234567/pqr', '', '', 'Valid'),
		//questionnaire due date is undefined
		_generateFakeAppeal('0000006', '1234567/stu', undefined, '', 'Valid'),
		//questionnaire due date is not a date-time string
		_generateFakeAppeal('0000007', '1234567/vwx', 'not-a-date-time-string', '', 'Valid'),
		//questionnaire received date is a valid date-time string
		_generateFakeAppeal(
			'0000008',
			'1234567/yza',
			new Date(Date.UTC(2023, 0, 31)),
			new Date(Date.UTC(2023, 1, 1)),
			'Valid'
		),
		//lpaCode is not Q9999
		_generateFakeAppeal(
			'0000009',
			'1234567/bcd',
			new Date(Date.UTC(2023, 0, 31)),
			'',
			'Valid',
			'L2440'
		),
		//appealType is not HAS
		_generateFakeAppeal(
			'0000010',
			'1234567/efg',
			new Date(Date.UTC(2023, 0, 31)),
			null,
			'Valid',
			'Q9999',
			'Not a HAS Appeal'
		)
	];

	const validTestAppeals = [
		//questionnaire received date is null
		_generateFakeAppeal('0000011', '1234567/hij', new Date(Date.UTC(2023, 0, 31)), null, 'Valid'),
		//questionnaire received date is an empty string
		_generateFakeAppeal('0000012', '1234567/klm', new Date(Date.UTC(2023, 0, 29)), '', 'Valid'),
		//questionnaire received date is not a date-time string
		_generateFakeAppeal(
			'0000013',
			'1234567/nop',
			new Date(Date.UTC(2023, 0, 30)),
			'not-a-date-time-string',
			'Valid'
		),
		//questionnaire received date is undefined
		_generateFakeAppeal(
			'0000014',
			'1234567/qrs',
			new Date(Date.UTC(2023, 0, 28)),
			undefined,
			'Valid'
		)
	];

	return invalidTestAppeals.concat(validTestAppeals);
};

const _generateFakeAppeal = (
	caseRef,
	applicationRef,
	questionnaireDueDate,
	questionnaireReceived,
	valid,
	lpaCode = 'Q9999',
	appealType = 'Householder (HAS) Appeal'
) => {
	const appeal = {
		_id: uuid.v4(),
		LPACode: lpaCode,
		caseReference: caseRef,
		appealType: appealType,
		LPAApplicationReference: applicationRef,
		questionnaireDueDate: questionnaireDueDate,
		questionnaireReceived: questionnaireReceived,
		validity: valid
	};

	//remove fields with undefined values (or mongo will replace them with null values)
	for (const [key, value] of Object.entries(appeal)) {
		if (value === undefined) {
			delete appeal[`${key}`];
		}
	}

	return appeal;
};

module.exports = { fakeAppealsCaseData };
