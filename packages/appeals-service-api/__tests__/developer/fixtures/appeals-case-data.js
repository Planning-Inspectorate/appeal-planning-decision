const uuid = require('uuid');

const fakeAppealsCaseData = () => {
	const invalidTestAppeals = [
		//valid is an empty string
		_generateFakeAppeal('0000000', '1234567/abc', '2023-07-06T13:53:31.5993119+00:00', '', ''),
		//valid is null
		_generateFakeAppeal('0000001', '1234567/def', '2023-07-07T11:53:31.5993119+00:00', '', null),
		//valid is undefined
		_generateFakeAppeal(
			'0000002',
			'1234567/ghi',
			'2023-07-07T12:53:31.5993119+00:00',
			'',
			undefined
		),
		//valid string is not the required string
		_generateFakeAppeal(
			'0000003',
			'1234567/jkl',
			'2023-07-08T13:53:31.5993119+00:00',
			'',
			'Not valid'
		),
		//appealType is not HAS
		_generateFakeAppeal(
			'0000010',
			'1234567/efg',
			'2023-07-08T13:53:31.5993119+00:00',
			null,
			'Valid',
			'Q9999',
			'Not a HAS Appeal'
		)
	];

	const validTestAppeals = [
		//questionnaire received date is null
		_generateFakeAppeal(
			'0000011',
			'1234567/hij',
			'2023-07-06T13:53:31.5993119+00:00',
			null,
			'Valid'
		),
		//questionnaire received date is an empty string
		_generateFakeAppeal('0000012', '1234567/klm', '2023-07-07T11:53:31.5993119+00:00', '', 'Valid'),
		//questionnaire received date is not a date-time string
		_generateFakeAppeal(
			'0000013',
			'1234567/nop',
			'2023-07-08T13:53:31.5993119+00:00',
			'not-a-date-time-string',
			'Valid'
		),
		//questionnaire received date is undefined
		_generateFakeAppeal(
			'0000014',
			'1234567/qrs',
			'2023-07-08T13:53:31.5993119+00:00',
			undefined,
			'Valid'
		),
		// url reserved chars in caseRef
		_generateFakeAppeal(
			'/@/1',
			'1234567/tuv',
			'2023-07-06T13:53:31.5993119+00:00',
			undefined,
			'Valid',
			'L2440'
		),
		_generateFakeAppeal(
			'0000009',
			'1234567/bcd',
			'2023-07-08T13:53:31.5993119+00:00',
			'',
			'Valid',
			'L2440'
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
