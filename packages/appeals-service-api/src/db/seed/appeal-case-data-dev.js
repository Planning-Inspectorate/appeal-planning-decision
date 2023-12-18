const { pickRandom, datesLastMonth, datesNextMonth } = require('./util');
const pastDates = datesLastMonth();
const futureDates = datesNextMonth();
const uuid = require('uuid');

const appealOne = {
	id: uuid.v4()
};

const appealTwo = {
	id: uuid.v4()
};

const appealThree = {
	id: uuid.v4()
};

const appealFour = {
	id: '756d6bfb-dde8-4532-a041-86c226a23b04'
};

const appealFive = {
	id: '756d6bfb-dde8-4532-a041-86c226a23b05'
};

const appealSix = {
	id: '756d6bfb-dde8-4532-a041-86c226a23b06'
};

const appealSeven = {
	id: '756d6bfb-dde8-4532-a041-86c226a23b07'
};

const appealEight = {
	id: '756d6bfb-dde8-4532-a041-86c226a23b08'
};

const appealNine = {
	id: '756d6bfb-dde8-4532-a041-86c226a23b09'
};

const appealTen = {
	id: '756d6bfb-dde8-4532-a041-86c226a23b10'
};

const appealEleven = {
	id: '756d6bfb-dde8-4532-a041-86c226a23b11'
};

const appealTwelve = {
	id: '756d6bfb-dde8-4532-a041-86c226a23b12'
};

const appealThirteen = {
	id: '756d6bfb-dde8-4532-a041-86c226a23b13'
};

const appealFourteen = {
	id: '756d6bfb-dde8-4532-a041-86c226a23b14'
};

const appealFifteen = {
	id: '756d6bfb-dde8-4532-a041-86c226a23b15'
};

const appealCaseData = [
	{
		Appeal: {
			connect: { id: appealOne.id }
		},
		caseReference: '0000000',
		LPACode: 'Q9999',
		LPAName: 'System Test Borough Council',
		appealTypeCode: 'HAS',
		appealTypeName: 'Householder',
		decision: 'refused',
		originalCaseDecisionDate: pickRandom(pastDates),
		costsAppliedForIndicator: false,
		LPAApplicationReference: '12/2323232/PLA',
		siteAddressLine1: 'New appeal',
		siteAddressLine2: null,
		siteAddressTown: 'No due dates',
		siteAddressCounty: 'Countyshire',
		siteAddressPostcode: 'BS1 6PN',
		questionnaireDueDate: null,
		questionnaireReceived: null,
		statementDueDate: null,
		LPAStatementSubmitted: null,
		finalCommentsDueDate: null,
		LPACommentsSubmitted: null,
		proofsOfEvidenceDueDate: null,
		LPAProofsSubmitted: null,
		outcome: null,
		caseDecisionDate: null
	},
	{
		Appeal: {
			connect: { id: appealTwo.id }
		},
		caseReference: '0000001',
		LPACode: 'Q9999',
		LPAName: 'System Test Borough Council',
		appealTypeCode: 'S78',
		appealTypeName: 'Full Planning',
		decision: 'refused',
		originalCaseDecisionDate: pickRandom(pastDates),
		costsAppliedForIndicator: false,
		LPAApplicationReference: '12/2323232/PLA',
		siteAddressLine1: 'Questionnaire and statement due',
		siteAddressLine2: null,
		siteAddressTown: 'Not submitted',
		siteAddressCounty: 'Countyshire',
		siteAddressPostcode: 'BS1 6PN',
		questionnaireDueDate: pickRandom(futureDates),
		questionnaireReceived: null,
		statementDueDate: pickRandom(futureDates),
		LPAStatementSubmitted: null,
		finalCommentsDueDate: null,
		LPACommentsSubmitted: null,
		proofsOfEvidenceDueDate: null,
		LPAProofsSubmitted: null,
		outcome: null,
		caseDecisionDate: null
	},
	{
		Appeal: {
			connect: { id: appealThree.id }
		},
		caseReference: '0000002',
		LPACode: 'Q9999',
		LPAName: 'System Test Borough Council',
		appealTypeCode: 'S78',
		appealTypeName: 'Full Planning',
		decision: 'refused',
		originalCaseDecisionDate: pickRandom(pastDates),
		costsAppliedForIndicator: false,
		LPAApplicationReference: '12/2323232/PLA',
		siteAddressLine1: 'Questionnaire overdue',
		siteAddressLine2: null,
		siteAddressTown: null,
		siteAddressCounty: 'Countyshire',
		siteAddressPostcode: 'BS1 6PN',
		questionnaireDueDate: pickRandom(pastDates),
		questionnaireReceived: null,
		statementDueDate: pickRandom(futureDates),
		LPAStatementSubmitted: null,
		finalCommentsDueDate: null,
		LPACommentsSubmitted: null,
		proofsOfEvidenceDueDate: null,
		LPAProofsSubmitted: null,
		outcome: null,
		caseDecisionDate: null
	},
	{
		Appeal: {
			connect: { id: appealFour.id }
		},
		caseReference: '0000003',
		LPACode: 'Q9999',
		LPAName: 'System Test Borough Council',
		appealTypeCode: 'S78',
		appealTypeName: 'Full Planning',
		decision: 'refused',
		originalCaseDecisionDate: pickRandom(pastDates),
		costsAppliedForIndicator: false,
		LPAApplicationReference: '12/2323232/PLA',
		siteAddressLine1: 'Questionnaire submitted',
		siteAddressLine2: null,
		siteAddressTown: 'Statement due',
		siteAddressCounty: 'Countyshire',
		siteAddressPostcode: 'BS1 6PN',
		questionnaireDueDate: pickRandom(pastDates),
		questionnaireReceived: pickRandom(pastDates),
		statementDueDate: pickRandom(futureDates),
		LPAStatementSubmitted: null,
		finalCommentsDueDate: null,
		LPACommentsSubmitted: null,
		proofsOfEvidenceDueDate: null,
		LPAProofsSubmitted: null,
		outcome: null,
		caseDecisionDate: null
	},
	{
		Appeal: {
			connect: { id: appealFive.id }
		},
		caseReference: '0000004',
		LPACode: 'Q9999',
		LPAName: 'System Test Borough Council',
		appealTypeCode: 'S78',
		appealTypeName: 'Full Planning',
		decision: 'refused',
		originalCaseDecisionDate: pickRandom(pastDates),
		costsAppliedForIndicator: false,
		LPAApplicationReference: '12/2323232/PLA',
		siteAddressLine1: 'Questionnaire submitted',
		siteAddressLine2: 'no comments or proofs',
		siteAddressTown: 'Statement overdue',
		siteAddressCounty: 'Countyshire',
		siteAddressPostcode: 'BS1 6PN',
		questionnaireDueDate: pickRandom(pastDates),
		questionnaireReceived: pickRandom(pastDates),
		statementDueDate: pickRandom(pastDates),
		LPAStatementSubmitted: null,
		finalCommentsDueDate: null,
		LPACommentsSubmitted: null,
		proofsOfEvidenceDueDate: null,
		LPAProofsSubmitted: null,
		outcome: null,
		caseDecisionDate: null
	},
	{
		Appeal: {
			connect: { id: appealSix.id }
		},
		caseReference: '0000005',
		LPACode: 'Q9999',
		LPAName: 'System Test Borough Council',
		appealTypeCode: 'S78',
		appealTypeName: 'Full Planning',
		decision: 'refused',
		originalCaseDecisionDate: pickRandom(pastDates),
		costsAppliedForIndicator: false,
		LPAApplicationReference: '12/2323232/PLA',
		siteAddressLine1: 'Questionnaire and statement submitted',
		siteAddressLine2: null,
		siteAddressTown: 'no comments or proofs due',
		siteAddressCounty: 'Countyshire',
		siteAddressPostcode: 'BS1 6PN',
		questionnaireDueDate: pickRandom(pastDates),
		questionnaireReceived: pickRandom(pastDates),
		statementDueDate: pickRandom(pastDates),
		LPAStatementSubmitted: pickRandom(pastDates),
		finalCommentsDueDate: null,
		LPACommentsSubmitted: null,
		proofsOfEvidenceDueDate: null,
		LPAProofsSubmitted: null,
		outcome: null,
		caseDecisionDate: null
	},
	{
		Appeal: {
			connect: { id: appealSeven.id }
		},
		caseReference: '0000006',
		LPACode: 'Q9999',
		LPAName: 'System Test Borough Council',
		appealTypeCode: 'S78',
		appealTypeName: 'Full Planning',
		decision: 'refused',
		originalCaseDecisionDate: pickRandom(pastDates),
		costsAppliedForIndicator: false,
		LPAApplicationReference: '12/2323232/PLA',
		siteAddressLine1: 'Questionnaire and statement submitted',
		siteAddressLine2: null,
		siteAddressTown: 'Comments due',
		siteAddressCounty: 'Countyshire',
		siteAddressPostcode: 'BS1 6PN',
		questionnaireDueDate: pickRandom(pastDates),
		questionnaireReceived: pickRandom(pastDates),
		statementDueDate: pickRandom(pastDates),
		LPAStatementSubmitted: pickRandom(pastDates),
		finalCommentsDueDate: pickRandom(futureDates),
		LPACommentsSubmitted: null,
		proofsOfEvidenceDueDate: null,
		LPAProofsSubmitted: null,
		outcome: null,
		caseDecisionDate: null
	},
	{
		Appeal: {
			connect: { id: appealEight.id }
		},
		caseReference: '0000007',
		LPACode: 'Q9999',
		LPAName: 'System Test Borough Council',
		appealTypeCode: 'S78',
		appealTypeName: 'Full Planning',
		decision: 'refused',
		originalCaseDecisionDate: pickRandom(pastDates),
		costsAppliedForIndicator: false,
		LPAApplicationReference: '12/2323232/PLA',
		siteAddressLine1: 'Questionnaire and statement submitted',
		siteAddressLine2: null,
		siteAddressTown: 'Comments overdue',
		siteAddressCounty: 'Countyshire',
		siteAddressPostcode: 'BS1 6PN',
		questionnaireDueDate: pickRandom(pastDates),
		questionnaireReceived: pickRandom(pastDates),
		statementDueDate: pickRandom(pastDates),
		LPAStatementSubmitted: pickRandom(pastDates),
		finalCommentsDueDate: pickRandom(pastDates),
		LPACommentsSubmitted: null,
		proofsOfEvidenceDueDate: null,
		LPAProofsSubmitted: null,
		outcome: null,
		caseDecisionDate: null
	},
	{
		Appeal: {
			connect: { id: appealNine.id }
		},
		caseReference: '0000008',
		LPACode: 'Q9999',
		LPAName: 'System Test Borough Council',
		appealTypeCode: 'S78',
		appealTypeName: 'Full Planning',
		decision: 'refused',
		originalCaseDecisionDate: pickRandom(pastDates),
		costsAppliedForIndicator: false,
		LPAApplicationReference: '12/2323232/PLA',
		siteAddressLine1: 'Questionnaire and statement submitted',
		siteAddressLine2: null,
		siteAddressTown: 'Comments submitted',
		siteAddressCounty: 'Countyshire',
		siteAddressPostcode: 'BS1 6PN',
		questionnaireDueDate: pickRandom(pastDates),
		questionnaireReceived: pickRandom(pastDates),
		statementDueDate: pickRandom(pastDates),
		LPAStatementSubmitted: pickRandom(pastDates),
		finalCommentsDueDate: pickRandom(pastDates),
		LPACommentsSubmitted: pickRandom(pastDates),
		proofsOfEvidenceDueDate: null,
		LPAProofsSubmitted: null,
		outcome: null,
		caseDecisionDate: null
	},
	{
		Appeal: {
			connect: { id: appealTen.id }
		},
		caseReference: '0000009',
		LPACode: 'Q9999',
		LPAName: 'System Test Borough Council',
		appealTypeCode: 'S78',
		appealTypeName: 'Full Planning',
		decision: 'refused',
		originalCaseDecisionDate: pickRandom(pastDates),
		costsAppliedForIndicator: false,
		LPAApplicationReference: '12/2323232/PLA',
		siteAddressLine1: 'Questionnaire and statement submitted',
		siteAddressLine2: null,
		siteAddressTown: 'proofs due',
		siteAddressCounty: 'Countyshire',
		siteAddressPostcode: 'BS1 6PN',
		questionnaireDueDate: pickRandom(pastDates),
		questionnaireReceived: pickRandom(pastDates),
		statementDueDate: pickRandom(pastDates),
		LPAStatementSubmitted: pickRandom(pastDates),
		finalCommentsDueDate: null,
		LPACommentsSubmitted: null,
		proofsOfEvidenceDueDate: pickRandom(futureDates),
		LPAProofsSubmitted: null,
		outcome: null,
		caseDecisionDate: null
	},
	{
		Appeal: {
			connect: { id: appealEleven.id }
		},
		caseReference: '0000010',
		LPACode: 'Q9999',
		LPAName: 'System Test Borough Council',
		appealTypeCode: 'S78',
		appealTypeName: 'Full Planning',
		decision: 'refused',
		originalCaseDecisionDate: pickRandom(pastDates),
		costsAppliedForIndicator: false,
		LPAApplicationReference: '12/2323232/PLA',
		siteAddressLine1: 'Questionnaire and statement submitted',
		siteAddressLine2: null,
		siteAddressTown: 'proofs overdue',
		siteAddressCounty: 'Countyshire',
		siteAddressPostcode: 'BS1 6PN',
		questionnaireDueDate: pickRandom(pastDates),
		questionnaireReceived: pickRandom(pastDates),
		statementDueDate: pickRandom(pastDates),
		LPAStatementSubmitted: pickRandom(pastDates),
		finalCommentsDueDate: null,
		LPACommentsSubmitted: null,
		proofsOfEvidenceDueDate: pickRandom(pastDates),
		LPAProofsSubmitted: null,
		outcome: null,
		caseDecisionDate: null
	},
	{
		Appeal: {
			connect: { id: appealTwelve.id }
		},
		caseReference: '0000011',
		LPACode: 'Q9999',
		LPAName: 'System Test Borough Council',
		appealTypeCode: 'S78',
		appealTypeName: 'Full Planning',
		decision: 'refused',
		originalCaseDecisionDate: pickRandom(pastDates),
		costsAppliedForIndicator: false,
		LPAApplicationReference: '12/2323232/PLA',
		siteAddressLine1: 'Questionnaire and statement submitted',
		siteAddressLine2: null,
		siteAddressTown: 'Proofs submitted',
		siteAddressCounty: 'Countyshire',
		siteAddressPostcode: 'BS1 6PN',
		questionnaireDueDate: pickRandom(pastDates),
		questionnaireReceived: pickRandom(pastDates),
		statementDueDate: pickRandom(pastDates),
		LPAStatementSubmitted: pickRandom(pastDates),
		finalCommentsDueDate: null,
		LPACommentsSubmitted: null,
		proofsOfEvidenceDueDate: pickRandom(pastDates),
		LPAProofsSubmitted: pickRandom(pastDates),
		outcome: null,
		caseDecisionDate: null
	},
	{
		Appeal: {
			connect: { id: appealThirteen.id }
		},
		caseReference: '1000012',
		LPACode: 'Q9999',
		LPAName: 'System Test Borough Council',
		appealTypeCode: 'S78',
		appealTypeName: 'Full Planning',
		decision: 'refused',
		originalCaseDecisionDate: pickRandom(pastDates),
		costsAppliedForIndicator: false,
		LPAApplicationReference: '12/2323232/PLA',
		siteAddressLine1: 'Decided',
		siteAddressLine2: null,
		siteAddressTown: 'Allowed',
		siteAddressCounty: 'Countyshire',
		siteAddressPostcode: 'BS1 6PN',
		questionnaireDueDate: pickRandom(pastDates),
		questionnaireReceived: pickRandom(pastDates),
		statementDueDate: pickRandom(pastDates),
		LPAStatementSubmitted: pickRandom(pastDates),
		finalCommentsDueDate: null,
		LPACommentsSubmitted: null,
		proofsOfEvidenceDueDate: pickRandom(pastDates),
		LPAProofsSubmitted: pickRandom(pastDates),
		outcome: 'allowed',
		caseDecisionDate: pickRandom(pastDates)
	},
	{
		Appeal: {
			connect: { id: appealFourteen.id }
		},
		caseReference: '1000013',
		LPACode: 'Q9999',
		LPAName: 'System Test Borough Council',
		appealTypeCode: 'S78',
		appealTypeName: 'Full Planning',
		decision: 'refused',
		originalCaseDecisionDate: pickRandom(pastDates),
		costsAppliedForIndicator: false,
		LPAApplicationReference: '12/2323232/PLA',
		siteAddressLine1: 'Decided',
		siteAddressLine2: null,
		siteAddressTown: 'Allowed',
		siteAddressCounty: 'Countyshire',
		siteAddressPostcode: 'BS1 6PN',
		questionnaireDueDate: pickRandom(pastDates),
		questionnaireReceived: pickRandom(pastDates),
		statementDueDate: pickRandom(pastDates),
		LPAStatementSubmitted: pickRandom(pastDates),
		finalCommentsDueDate: null,
		LPACommentsSubmitted: null,
		proofsOfEvidenceDueDate: pickRandom(pastDates),
		LPAProofsSubmitted: pickRandom(pastDates),
		outcome: 'dismissed',
		caseDecisionDate: pickRandom(pastDates)
	},
	{
		Appeal: {
			connect: { id: appealFifteen.id }
		},
		caseReference: '1000014',
		LPACode: 'Q9999',
		LPAName: 'System Test Borough Council',
		appealTypeCode: 'S78',
		appealTypeName: 'Full Planning',
		decision: 'refused',
		originalCaseDecisionDate: pickRandom(pastDates),
		costsAppliedForIndicator: false,
		LPAApplicationReference: '12/2323232/PLA',
		siteAddressLine1: 'Decided',
		siteAddressLine2: null,
		siteAddressTown: 'Allowed',
		siteAddressCounty: 'Countyshire',
		siteAddressPostcode: 'BS1 6PN',
		questionnaireDueDate: pickRandom(pastDates),
		questionnaireReceived: pickRandom(pastDates),
		statementDueDate: pickRandom(pastDates),
		LPAStatementSubmitted: pickRandom(pastDates),
		finalCommentsDueDate: null,
		LPACommentsSubmitted: null,
		proofsOfEvidenceDueDate: pickRandom(pastDates),
		LPAProofsSubmitted: pickRandom(pastDates),
		outcome: 'split decision',
		caseDecisionDate: pickRandom(pastDates)
	}
];

module.exports = {
	appealCaseData
};
